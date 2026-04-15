import argparse
import os
import sys
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel


# ─── Paths & Constants ────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
ADAPTER_PATH = os.path.join(SCRIPT_DIR, "medical_lora_adapter")
BASE_MODEL   = "EleutherAI/pythia-1b"


def load_model(device: str | None = None):

    if device is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"

    print(f"[*] Device           : {device}")
    print(f"[*] Base model       : {BASE_MODEL}")
    print(f"[*] LoRA adapter     : {ADAPTER_PATH}")

    tokenizer = AutoTokenizer.from_pretrained(ADAPTER_PATH)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    base_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL)

    model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
    model = model.to(device)
    model.eval()

    total_params = sum(p.numel() for p in model.parameters())
    print(f"[*] Total parameters : {total_params:,}")
    print("[✓] Model loaded successfully.\n")

    return model, tokenizer, device


def generate(model, tokenizer, device: str, prompt: str,
             max_new_tokens: int = 60, temperature: float = 0.7,
             top_p: float = 0.9, do_sample: bool = True,
             repetition_penalty: float = 1.2) -> str:

    inputs = tokenizer(prompt, return_tensors="pt").to(device)

    with torch.no_grad():
        output_ids = model.generate(
            **inputs,
            max_new_tokens=max_new_tokens,
            do_sample=do_sample,
            temperature=temperature,
            top_p=top_p,
            repetition_penalty=repetition_penalty,
        )

    generated_ids = output_ids[0][inputs["input_ids"].shape[-1]:]
    return tokenizer.decode(generated_ids, skip_special_tokens=True).strip()


TEST_PROMPTS = [
    {
        "label": "Term → Description  (Paracetamol Poisoning)",
        "prompt": "Term: Paracetamol Poisoning\nDescription:",
    },
    {
        "label": "Term → Description  (Asthma)",
        "prompt": "Term: Asthma\nDescription:",
    },
    {
        "label": "Term → Description  (Diabetes Mellitus)",
        "prompt": "Term: Diabetes Mellitus\nDescription:",
    },
    {
        "label": "Symptoms → Diagnosis (liver failure after overdose)",
        "prompt": "Description: patient presents with nausea and liver failure after overdose\nDiagnosis:",
    },
    {
        "label": "Symptoms → Diagnosis (chest tightness & wheezing)",
        "prompt": "Description: patient complains of chest tightness, wheezing, and shortness of breath\nDiagnosis:",
    },
    {
        "label": "Symptoms → Diagnosis (frequent urination & thirst)",
        "prompt": "Description: patient reports frequent urination, excessive thirst, and unexplained weight loss\nDiagnosis:",
    },
]


def run_tests(model, tokenizer, device, max_new_tokens: int = 60):
    print("=" * 70)
    print("  MEDIBOT  ·  Inference Test Suite")
    print("=" * 70)

    for i, case in enumerate(TEST_PROMPTS, 1):
        print(f"\n{'─' * 70}")
        print(f"  Test {i}: {case['label']}")
        print(f"{'─' * 70}")
        print(f"  Prompt  : {case['prompt']}")
        response = generate(model, tokenizer, device, case["prompt"],
                            max_new_tokens=max_new_tokens)
        print(f"  Response: {response}")

    print(f"\n{'=' * 70}")
    print("  All tests complete.")
    print(f"{'=' * 70}\n")


def interactive_mode(model, tokenizer, device, max_new_tokens: int = 60):
    print("=" * 70)
    print("  MEDIBOT  ·  Interactive Mode")
    print("  Type a prompt and press Enter.  Type 'quit' or Ctrl-C to exit.")
    print()
    print("  Prompt formats the model was trained on:")
    print("    • Term: <medical term>\\nDescription:")
    print("    • Description: <symptoms>\\nDiagnosis:")
    print("=" * 70)

    while True:
        try:
            raw = input("\n>>> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if raw.lower() in ("quit", "exit", "q"):
            print("Goodbye!")
            break

        if not raw:
            continue

        prompt = raw.replace("\\n", "\n")
        response = generate(model, tokenizer, device, prompt,
                            max_new_tokens=max_new_tokens)
        print(f"\n{response}")


def parse_args():
    parser = argparse.ArgumentParser(
        description="MediBot inference — OPT-125m + LoRA medical adapter"
    )
    parser.add_argument(
        "--prompt", type=str, default=None,
        help="Single prompt to run (use \\n for newlines). "
             "If omitted, runs test suite then interactive mode.",
    )
    parser.add_argument(
        "--max-tokens", type=int, default=60,
        help="Maximum new tokens to generate (default: 60).",
    )
    parser.add_argument(
        "--temperature", type=float, default=0.7,
        help="Sampling temperature (default: 0.7, use 0 for greedy).",
    )
    parser.add_argument(
        "--greedy", action="store_true",
        help="Use greedy decoding (equivalent to --temperature 0).",
    )
    parser.add_argument(
        "--device", type=str, default=None,
        help="Force device: 'cpu' or 'cuda' (auto-detected by default).",
    )
    parser.add_argument(
        "--tests-only", action="store_true",
        help="Run test suite and exit (skip interactive mode).",
    )
    return parser.parse_args()


def main():
    args = parse_args()

    do_sample = not args.greedy
    temperature = 0.0 if args.greedy else args.temperature

    model, tokenizer, device = load_model(device=args.device)

    if args.prompt:
        prompt = args.prompt.replace("\\n", "\n")
        print(f"Prompt: {prompt}")
        response = generate(model, tokenizer, device, prompt,
                            max_new_tokens=args.max_tokens,
                            temperature=temperature,
                            do_sample=do_sample)
        print(f"Response: {response}")
    else:
        run_tests(model, tokenizer, device, max_new_tokens=args.max_tokens)

        if not args.tests_only:
            interactive_mode(model, tokenizer, device,
                             max_new_tokens=args.max_tokens)


if __name__ == "__main__":
    main()
