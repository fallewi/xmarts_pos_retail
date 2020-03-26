# -*- coding: utf-8 -*-

from odoo import models, fields, api


class pos_orders(models.Model):
    _inherit = "pos.order"
    #Se agrega campo para estado de prendas
    laundry_state = fields.Selection([('pendiente','Pendiente'),('proceso','En proceso'),('terminado','Listo Para Entrega'),('entregado','Entregado')], default='pendiente', string="Estado de prendas", stored=True)
    laundry_priority = fields.Selection([('normal','Normal'),('urgente','Urgente'),('extraurgente','Extra Urgente')], default='normal', string="Prioridad", stored=True)
    fechahora = fields.Char(string="Fecha/Hora de atencion")
    fechahorae = fields.Char(string="Fecha/Hora de entrega")
   

    @api.model
    def compute_laundry(self, x):
        order = self.env['pos.order'].search([('id','=',x)], limit=1)
        r = str(order.laundry_state)
        s = str(order.laundry_priority)
        f = str(order.fechahora)
        e = str(order.fechahorae)
        return {"r": r, "s":s, "f":f, "e":e}

    @api.model
    def compute_laundry_state(self, x):
        print("Datos :::: ",x)
        order = self.env['pos.order'].search([('id','=',x[0])], limit=1)
        print("Datos ::::: ",x[1])
        order.update({'laundry_state': x[1]})
        res = x[1]
        return {"res": res}

    @api.model
    def compute_cancelar_order(self, x):
        print("Datos :::: ",x)
        order = self.env['pos.order'].search([('id','=',x[0])], limit=1)
        order.update({'state': x[1]})
        res = x[1]
        return {"res": res}

    @api.model
    def _order_fields(self, ui_order):
        order_fields = super(pos_orders, self)._order_fields(ui_order)
        #Se agrega get de estado de prendas
        if ui_order.get('laundry_state', False):
            order_fields.update({
                'laundry_state': ui_order['laundry_state']
            })
        if ui_order.get('laundry_priority', False):
            order_fields.update({
                'laundry_priority': ui_order['laundry_priority']
            })
        if ui_order.get('fechahora', False):
            order_fields.update({
                'fechahora': ui_order['fechahora']
            })
        if ui_order.get('fechahorae', False):
            order_fields.update({
                'fechahorae': ui_order['fechahorae']
            })
        if ui_order.get('add_credit', False):
            order_fields.update({
                'add_credit': ui_order['add_credit']
            })
        if ui_order.get('medical_insurance_id', False):
            order_fields.update({
                'medical_insurance_id': ui_order['medical_insurance_id']
            })
        if ui_order.get('partial_payment', False):
            order_fields.update({
                'partial_payment': ui_order['partial_payment']
            })
        if ui_order.get('sale_id', False):
            order_fields.update({
                'sale_id': ui_order['sale_id']
            })
        if ui_order.get('delivery_date', False):
            order_fields.update({
                'delivery_date': ui_order['delivery_date']
            })
        if ui_order.get('delivery_address', False):
            order_fields.update({
                'delivery_address': ui_order['delivery_address']
            })
        if ui_order.get('parent_id', False):
            order_fields.update({
                'parent_id': ui_order['parent_id']
            })
        if ui_order.get('invoice_journal_id', False):
            order_fields['invoice_journal_id'] = ui_order.get('invoice_journal_id')
        if ui_order.get('ean13', False):
            order_fields.update({
                'ean13': ui_order['ean13']
            })
        if ui_order.get('expire_date', False):
            order_fields.update({
                'expire_date': ui_order['expire_date']
            })
        if ui_order.get('is_return', False):
            order_fields.update({
                'is_return': ui_order['is_return']
            })
        if ui_order.get('email', False):
            order_fields.update({
                'email': ui_order.get('email')
            })
        if ui_order.get('email_invoice', False):
            order_fields.update({
                'email_invoice': ui_order.get('email_invoice')
            })
        if ui_order.get('create_voucher', False):
            order_fields.update({
                'create_voucher': ui_order.get('create_voucher')
            })
        if ui_order.get('plus_point', 0):
            order_fields.update({
                'plus_point': ui_order['plus_point']
            })
        if ui_order.get('redeem_point', 0):
            order_fields.update({
                'redeem_point': ui_order['redeem_point']
            })
        if ui_order.get('note', None):
            order_fields.update({
                'note': ui_order['note']
            })
        if ui_order.get('return_order_id', False):
            order_fields.update({
                'return_order_id': ui_order['return_order_id']
            })
        if ui_order.get('location_id', False):
            order_fields.update({
                'location_id': ui_order['location_id']
            })
        if ui_order.get('receipt_xml', False):
            order_fields.update({
                'receipt_xml': ui_order['receipt_xml']
            })
        if ui_order.get('receipt_html', False):
            order_fields.update({
                'receipt_html': ui_order['receipt_html']
            })
        if ui_order.get('booking_id', False):
            order_fields.update({
                'booking_id': ui_order['booking_id']
            })
        return order_fields