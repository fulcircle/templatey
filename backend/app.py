from flask import Flask, jsonify, request
from classes.template_render import TemplateRender
app = Flask(__name__)


@app.route('/api/template/render', methods=['POST'])
def template_render():
    json = request.json
    template_text = json['template_text']
    template_data = json['fields']

    _template_render = TemplateRender(template_text, template_data)
    template_string = _template_render.render()

    return jsonify({
        'template_name': _template_render.template_name,
        'template': template_string
    })

