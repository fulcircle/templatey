from settings.keys import SENDGRID_API_KEY
import sendgrid
from sendgrid.helpers.mail import *


class SendEmail:

    def __init__(self, _from, _to, subject, content, content_type="text/html"):
        self._from = _from
        self._to = _to
        self.subject = subject
        self.content = content
        self.content_type = content_type
        self.api_key = SENDGRID_API_KEY

    def send(self):
        from_email = Email(self._from)
        to_email = Email(self._to)
        subject = self.subject
        content = Content(self.content_type, self.content)
        sg = sendgrid.SendGridAPIClient(apikey=self.api_key)
        mail = Mail(from_email, subject, to_email, content)
        response = sg.client.mail.send.post(request_body=mail.get())
        return response

