odoo.define('xmarts_pos_retail.popups_custom', function (require) {

    var core = require('web.core');
    var _t = core._t;
    var gui = require('point_of_sale.gui');
    var PopupWidget = require('point_of_sale.popups');
    var rpc = require('pos.rpc');
    var qweb = core.qweb;   
    var popup_order_priority = PopupWidget.extend({
        template: 'popup_order_priority',
        init: function (parent, options) {
            this._super(parent, options);
        },
        show: function (options) {
            var self = this;
            this._super(options);
            var order = self.pos.get_order();
            var today = new Date();
            var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes();
            var fh = date+' '+time;
            this.$('.normal').click(function () {
                order.set_priority('Normal');
                order.set_fechahora(fh);
                order['laundry_priority'] = 'normal';

                var da = new Date();
                da.setDate(da.getDate() + 2);
                var d = da.getFullYear()+'/'+(da.getMonth()+1)+'/'+da.getDate();
                var t = '18' + ":" + '00';
                var fhe = d+' '+t;

                order.set_fechahorae(fhe)
                self.click_confirm();
            })
            this.$('.urgente').click(function () {
                order.set_priority('Urgente');
                order.set_fechahora(fh);
                order['laundry_priority'] = 'urgente';

                var da = new Date();
                da.setDate(da.getDate() + 1);
                var d = da.getFullYear()+'/'+(da.getMonth()+1)+'/'+da.getDate();
                var t = '18' + ":" + '00';
                var fhe = d+' '+t;

                order.set_fechahorae(fhe)
                self.click_confirm();
            })
            this.$('.extraurgente').click(function () {
                order.set_priority('Extra Urgente');
                order.set_fechahora(fh);
                order['laundry_priority'] = 'extraurgente';

                var t = '18' + ":" + '00';
                var fhe = date+' '+t;
                order.set_fechahorae(fhe)
                self.click_confirm();
            })
        }
    });
    gui.define_popup({
        name: 'popup_order_priority',
        widget: popup_order_priority
    });
   });