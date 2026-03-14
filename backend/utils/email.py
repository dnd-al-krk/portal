from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def send_email(subject, template, context=None, *args, **kwargs):
    message = render_to_string(template, context)

    email = EmailMultiAlternatives(
        subject, "This message is readable only in HTML form.", from_email=settings.EMAIL_FROM, *args, **kwargs
    )
    email.attach_alternative(message, "text/html")
    email.send(fail_silently=True)
