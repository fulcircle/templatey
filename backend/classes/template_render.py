from flask import render_template
class TemplateRender:

    def __init__(self, template_name='basic', template_data=None):
        self.template_name = template_name
        self.template_data = template_data

    def render(self):
        if self.template_data:
            return render_template(f'{self.template_name}.html', **self.template_data)
        else:
            return render_template(f'{self.template_name}.html')
