from typing import IO


class FileChuckReaderIterator:
    def __init__(self, file_path: str, mode: str, chuck_size_in_bytes: int = 4 * (1024 ** 2)):
        self.chuck_size = chuck_size_in_bytes
        self.file_path = file_path
        self.mode = mode
        self.file_io: IO = None

    def __iter__(self):
        self.file_io = open(self.file_path, self.mode)
        return self

    def __next__(self):
        chunk = self.file_io.read(self.chuck_size)
        if len(chunk) > 0:
            return chunk
        else:
            self.file_io.close()
            raise StopIteration

    def __del__(self):
        self.file_io.close()

