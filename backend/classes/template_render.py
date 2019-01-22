from flask import render_template
class TemplateRender:

    def __init__(self, template_name='basic', template_data=None):
        self.template_name = template_name
        self.template_data = template_data

    def render(self):
        return render_template(f'{self.template_name}.html', **self.template_data)
