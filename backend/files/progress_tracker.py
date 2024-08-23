import numpy as np


class ProgressTracker:
    def __init__(self, phase_weights_array: list[float]):
        self.phase_weights_array = phase_weights_array
        self.progress_array = [0.0 for _ in range(len(phase_weights_array))]

    def update_progress(self, phase: int, percentage: float):
        if phase > len(self.phase_weights_array):
            raise IndexError("phase out of bounds")
        self.progress_array[phase - 1] = percentage
        print(f"total :{self.get_total_progress() * 100:.3f}%")

    def get_total_progress(self):
        return np.multiply(self.progress_array, self.phase_weights_array).sum()
