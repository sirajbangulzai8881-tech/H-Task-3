import confetti from 'canvas-confetti';

export function fireSuccessConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
      disableForReducedMotion: true,
    });
  } catch (e) {
    // ignore
  }
}
