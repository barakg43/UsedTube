from collections import defaultdict

class ProgressTracker:
    def __init__(self):
        self._progress = defaultdict(float)

    def update(self, key, value):
        self._progress[key] = value

    def get(self, key):
        return self._progress[key]

    def delete(self, key):
        del self._progress[key]
        
        
Tracker = ProgressTracker()