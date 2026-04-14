#!/usr/bin/env python3
"""Write procedural sounds still used as WAV (calibration, clicker, buzzer). Run: python3 scripts/build_sounds.py"""
import math
import os
import struct

SR = 22050
OUT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "sounds"))


def write_mono_wav(filename, num_samples, sample_at):
    pcm = bytearray()
    for i in range(num_samples):
        s = sample_at(i, num_samples)
        s = max(-1.0, min(1.0, s))
        pcm.extend(struct.pack("<h", int(s * 0x7FFF)))

    data_size = len(pcm)
    riff_chunk_size = 36 + data_size
    header = struct.pack(
        "<4sI4s4sIHHIIHH4sI",
        b"RIFF",
        riff_chunk_size,
        b"WAVE",
        b"fmt ",
        16,
        1,
        1,
        SR,
        SR * 2,
        2,
        16,
        b"data",
        data_size,
    )

    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, filename)
    with open(path, "wb") as f:
        f.write(header)
        f.write(pcm)
    print("wrote", path)


def main():
    write_mono_wav(
        "calibration.wav",
        int(0.22 * SR),
        lambda i, num: (
            math.sin((2 * math.pi * 880 * (i / SR)) / 1)
            * 0.35
            * min(1, i / 120)
            * min(1, (num - i) / 400)
        ),
    )

    write_mono_wav(
        "clicker.wav",
        int(0.06 * SR),
        lambda i, num: (
            math.sin(2 * math.pi * 2600 * (i / SR)) * math.exp(-(i / SR) * 95) * 0.85
            + math.sin(2 * math.pi * 5200 * (i / SR)) * math.exp(-(i / SR) * 120) * 0.25
        ),
    )

    write_mono_wav(
        "buzzer.wav",
        int(0.32 * SR),
        lambda i, num: (
            (1 if math.sin(2 * math.pi * 105 * (i / SR)) >= 0 else -1)
            * 0.38
            * min(1, i / 40)
            * min(1, (num - i) / 120)
        ),
    )

    print("done ->", OUT)


if __name__ == "__main__":
    main()
