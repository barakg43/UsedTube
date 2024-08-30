import numpy as np

from django_server.settings import DEBUG


class ProgressTracker:
    def __init__(self, phase_weights_array: list[float]):
        self.phase_weights_array = phase_weights_array
        self.progress_array = [0.0 for _ in range(len(phase_weights_array))]

    def update_progress(self, phase: int, percentage: float):
        if phase > len(self.phase_weights_array):
            raise IndexError("phase out of bounds")
        self.progress_array[phase - 1] = percentage
        # print(f"phase 1 :{ self.progress_array[0]*100:.2f}% # "
        #       f"phase 2 :{ self.progress_array[1]*100:.2f}% # "
        #       f"phase 3 :{ self.progress_array[2]*100:.2f}% # "
        #       f"phase 4 :{ self.progress_array[3]*100:.2f}% # "
        #       )

        if DEBUG:
             print(f"total :{self.get_total_progress() * 100:.3f}%")

    def get_total_progress(self):
        return np.multiply(self.progress_array, self.phase_weights_array).sum()
