import cv2
import numpy as np
import os
import os
class Encryptor:

    def __init__(self):
        self.file_size=64153731

    def encrypt(self, file_path, video_path):
        """"
        :parameter file_path receives a file to encrypt
        :parameter video_path a video to intertwine the encrypted file with
        :returns encrypted video, metadata
        """
        cover_video = cv2.VideoCapture(video_path)
        # W,H
        self.file_size=os.path.getsize(file_path)
        print( self.file_size)
        DIMS, ENCODING, FPS = self.get_cover_video_metadata(cover_video)
        length = int(cover_video.get(cv2.CAP_PROP_FRAME_COUNT))
        count=0
        frame_number=1
        with open(file_path, 'rb') as file_to_encrypt:
            output_video = cv2.VideoWriter("../resources/output.mp4", ENCODING, FPS, DIMS)
            file_bytes_chunk = file_to_encrypt.read(DIMS[0] * DIMS[1])
            while(cover_video.isOpened()and file_bytes_chunk):
                ret=True
                # for i in range(24):
                ret, frame = cover_video.read()
                # output_video.write(frame)
                frame_number+=1
                    # if not ret:
                        #     break
                if not ret:
                    break
                if(file_bytes_chunk):
                   filled_array = np.zeros(DIMS[1] * DIMS[0])
                   filled_array[:len(file_bytes_chunk)] = list(file_bytes_chunk)
                   bytes_as_pixels2d = np.array(filled_array).reshape(DIMS[1], DIMS[0])

                   np.savetxt('frame_%s.csv' % count, bytes_as_pixels2d, fmt="%d", delimiter=",")
                   pixels_as_frame = np.dstack([bytes_as_pixels2d, bytes_as_pixels2d, bytes_as_pixels2d])
                   # print('frame number:'+str(frame_number))
                   output_video.write(pixels_as_frame)
                   frame_number += 1
                   # print(pixels_as_frame)
                   file_bytes_chunk = file_to_encrypt.read(DIMS[0] * DIMS[1])
                   count+=1
            cover_video.release()
            output_video.release()
            # Closes all the frames
            cv2.destroyAllWindows()
            print("number of file frame:"+str(count))
            # print(frame)
            # create a frame based on the file's binary




            print(6)
    # def read_video(self,cap):
    #     if (cap.isOpened() == False):
    #         print("Error opening video stream or file")
    #
    #     # Read until video is completed
    #     frame_num = 0
    #     while (cap.isOpened()):
    #         # Capture frame-by-frame
    #         ret, frame = cap.read()
    #         # print(frame_num)
    #         if ret == True:
    #
    #             # Display the resulting frame
    #             processed_frame = single_frame_processor(frame)
    #             result_video.write(processed_frame)
    #             cv2.imshow("frame_string", processed_frame)
    #             frame_num += 1
    #             drawProgressBar(frame_num / length)
    #             # # Press Q on keyboard to  exit
    #             if cv2.waitKey(1) & 0xFF == ord('q'):
    #                 break
    #
    #         # Break the loop
    #         else:
    #             break
    #
    #     # When everything done, release the video capture object
    #     cap.release()
    #     result_video.release()
    #
    #     # Closes all the frames
    #     cv2.destroyAllWindows()

    def get_cover_video_metadata(self, cover_video):
        DIMS = (int(cover_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cover_video.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        FPS = cover_video.get(cv2.CAP_PROP_FPS)
        ENCODING = cv2.VideoWriter.fourcc(*'mp4v')
        return DIMS, ENCODING, FPS
    def decrypt(self, metadata):

        cover_video = cv2.VideoCapture(metadata)
        DIMS, ENCODING, FPS = self.get_cover_video_metadata(cover_video)
        start_frame_number = 25
        # cover_video.set(cv2.CAP_PROP_POS_FRAMES, start_frame_number)
        remain_file_size_to_read=self.file_size
        frame_size=DIMS[1] * DIMS[0]
        file_as_pixel_array=np.empty(0)
        count=0

        while (cover_video.isOpened()):

            ret, encrypt_frame = cover_video.read()
            if not ret:
                break

            remain_file_size_to_read-=frame_size
            filled_array = np.zeros(frame_size)
            # np.savetxt('frame_%s.csv' % count, bytes_as_pixels2d, fmt="%d", delimiter=",")
            bytes_as_pixels2d_list3 =  np.split(encrypt_frame,3,axis=2)
            bytes_amount=frame_size if remain_file_size_to_read>frame_size else remain_file_size_to_read
            flatten_pixel_array= bytes_as_pixels2d_list3[0].reshape(DIMS[0] * DIMS[1])[:bytes_amount]
            file_as_pixel_array=np.concatenate((file_as_pixel_array, flatten_pixel_array))
            print('Position:', cover_video.get(cv2.CAP_PROP_POS_FRAMES))
            # np.savetxt('frame_dec_%s.csv' % count, bytes_as_pixels2d_list3[0].reshape(2160,3840), fmt="%d", delimiter=",")
            count+=1
            # cover_video.set(cv2.CAP_PROP_POS_FRAMES, start_frame_number*(count+1))

        decrypt_file = open("../resources/sample_decrypt.pdf", "wb")
        decrypt_file.write(file_as_pixel_array.tobytes())
        cover_video.release()
        # Closes all the frames
        cv2.destroyAllWindows()
        # print("number of file frame:" + str(count))


enc = Encryptor()
enc.encrypt("../resources/sample-file2.pdf", '../resources/sample.mp4')
enc.decrypt("../resources/output.mp4")
