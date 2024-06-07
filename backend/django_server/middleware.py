
class ResponseLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Print the response headers
        print("[Response Headers:]\n#################")
        for header, value in response.items():
            print(f"{header}: {value}")

        # Print the response content
        print("[Response Content:]\n#################")
        try :
            print(response.content)
        except:
            print("No content")

        return response