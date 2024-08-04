import uuid
from collections import defaultdict
from threading import Lock


class ProgressTracker:
    _lock = Lock()

    def __init__(self):
        self._progress = defaultdict(float)

    def set_progress(self, key: uuid, value):
        ProgressTracker._lock.acquire()
        self._progress[str(key)] = value
        ProgressTracker._lock.release()

    def get_progress(self, key):
        return self._progress[key]

    def delete(self, key):
        ProgressTracker._lock.acquire()
        del self._progress[key]
        ProgressTracker._lock.release()


Tracker = ProgressTracker()
