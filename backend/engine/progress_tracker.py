from collections import defaultdict
from threading import Lock

class ProgressTracker:
    _lock = Lock()
    def __init__(self):
        self._progress = defaultdict(float)

    def update(self, key, value):
        ProgressTracker._lock.acquire()
        self._progress[key] = value
        ProgressTracker._lock.release()

    def get(self, key):
        return self._progress[key]

    def delete(self, key):
        ProgressTracker._lock.acquire()
        del self._progress[key]
        ProgressTracker._lock.release()
        
        
Tracker = ProgressTracker()