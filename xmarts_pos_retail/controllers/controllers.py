# -*- coding: utf-8 -*-
from odoo import http

# class XmartsPosRetail(http.Controller):
#     @http.route('/xmarts_pos_retail/xmarts_pos_retail/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/xmarts_pos_retail/xmarts_pos_retail/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('xmarts_pos_retail.listing', {
#             'root': '/xmarts_pos_retail/xmarts_pos_retail',
#             'objects': http.request.env['xmarts_pos_retail.xmarts_pos_retail'].search([]),
#         })

#     @http.route('/xmarts_pos_retail/xmarts_pos_retail/objects/<model("xmarts_pos_retail.xmarts_pos_retail"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('xmarts_pos_retail.object', {
#             'object': obj
#         })