from flask import Flask,jsonify
from classes.template_render import TemplateRender
app = Flask(__name__)


@app.route('/api/template/render', methods=['POST'])
def template_render():
    # TODO: deal with errors any errors
    _template_render = TemplateRender('basic', {'user': 'TestUser'})
    template_string = _template_render.render()
    return jsonify({
        'template': _template_render.template_name,
        'template_string': template_string
    })
