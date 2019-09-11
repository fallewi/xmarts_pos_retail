odoo.define('xmarts_pos_retail.buttons_custom', function (require) {
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var _t = core._t;
    var qweb = core.qweb;
    var WebClient = require('web.AbstractWebClient');
    var rpc = require('pos.rpc');


    var button_order_priority = screens.ActionButtonWidget.extend({
        template: 'button_order_priority',
        button_click: function () {
            var order = this.pos.get_order();
            if (order) {
                this.gui.show_popup('popup_order_priority', {
                    title: _t('Prioridad'),
                    value: order.get_note(),
                    confirm: function (priority) {
                        
                    }
                });
            }
        }
    });

    screens.define_action_button({
        'name': 'button_order_priority',
        'widget': button_order_priority,
        'condition': function () {
            return true;
        }
    });
});