from flask import Flask, jsonify, request
from classes.template_render import TemplateRender
from classes.send_email import SendEmail
app = Flask(__name__)


def get_renderer():
    json = request.json
    template_text = json['to_render']['template_text']
    template_data = json['to_render']['fields']

    _template_renderer = TemplateRender(template_text, template_data)
    return _template_renderer


@app.route('/api/template/render', methods=['POST'])
def template_render():

    _template_renderer = get_renderer()
    render = _template_renderer.render()

    return jsonify({
        'template_name': _template_renderer.template_name,
        'template': render
    })


@app.route('/api/template/send', methods=['POST'])
def send_template():
    _template_renderer = get_renderer()
    content = _template_renderer.render()
    response = SendEmail(request.json['email_fields']['from'], request.json['email_fields']['to'], 'Test', content).send()
    return jsonify({
        'status_code': response.status_code,
    })




