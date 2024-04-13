

class ObfuscationManager:

    def __init__(self, intermeshing_cycle=1):
        """
        Mix serialized frames with frames of a real video inorder to make
        the serialized videos hard to notice.
        first frame of uploaded videos are always of the serialized file.
        :param intermeshing_cycle: the amount of cover video frames between 2
        serialized frames.
        """
        self.cycle = intermeshing_cycle


    def obfuscate(self, file_frames_path, cover_video_path) -> str:
        pass

    def untangle(self, obfuscated_video) -> str:
        pass
