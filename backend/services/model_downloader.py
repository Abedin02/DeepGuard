import os
from pathlib import Path
from huggingface_hub import hf_hub_download

BACKEND_ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = BACKEND_ROOT / "models"

MODEL_FILES = {
    "image_model.pth": "image_model.pth",
    "best_xception_weights.h5": "best_xception_weights.h5",
    "best_model_acc.keras": "best_model_acc.keras",
    "audio_model.pth": "audio_model.pth",
    "video_model.pth": "video_model.pth",
}


def ensure_model_files():
    repo_id = os.getenv("HF_MODEL_REPO")
    token = os.getenv("HF_TOKEN")

    if not repo_id:
        raise RuntimeError("HF_MODEL_REPO is missing")

    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    for local_filename, hf_filename in MODEL_FILES.items():
        target_path = MODELS_DIR / local_filename

        if target_path.exists() and target_path.stat().st_size > 0:
            print(f"[DeepGuard] Model already exists: {target_path}")
            continue

        print(f"[DeepGuard] Downloading {hf_filename} from Hugging Face...")

        downloaded_path = hf_hub_download(
            repo_id=repo_id,
            filename=hf_filename,
            token=token,
        )

        downloaded_path = Path(downloaded_path)

        # Copy into backend/models using the names model_runner already expects
        target_path.write_bytes(downloaded_path.read_bytes())

        print(f"[DeepGuard] Saved model to: {target_path}")