from flask import render_template, current_app as app


class TemplateRender:

    def __init__(self, template_text, template_fields, template_name='basic'):
        self.template_text = template_text
        self.template_fields = template_fields
        self.template_name = template_name

        self.text_env = app.create_jinja_environment()
        self.text_env.variable_start_string = '%%'
        self.text_env.variable_end_string = '%%'

    def render(self):

        # Convert array to dict
        template_vars = {}
        for field in self.template_fields:
            template_vars[field['name']] = field['value']

        # Convert Spaces and Newlines into HTML Equivalent
        template_text = self.template_text.replace('\n', '<br/>')
        template_string = self.text_env.from_string(template_text).render(**template_vars)
        return render_template(f'{self.template_name}.html', text=template_string)

