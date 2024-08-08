import itertools


class AtomicCounter:

    def __init__(self, initial_value=0):
        self._incs = itertools.count(initial_value)
        self._accesses = itertools.count()

    def increment(self):
        return next(self._incs)

    def value(self):
        return next(self._incs) - next(self._accesses)

    def __getitem__(self, item):
        return self.value()

    def __len__(self):
        return self.value()

    def __str__(self):
        return str(self.value())