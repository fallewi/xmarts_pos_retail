
"use strict";
odoo.define('xmarts_pos_retail.screen_order_widget_custom', function (require) {

    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var _t = core._t;
    var field_utils = require('web.field_utils');

    screens.OrderWidget.include({
        update_summary: function () {
            this._super();
            var self = this;
            $('.mode-button').click(function () {
                self.change_mode();
            });
            if (this.pos.config.multi_lots) {
                $(".line-lot-icon").addClass('oe_hidden');
            }
            var selected_order = this.pos.get_order();
            var buttons = this.getParent().action_buttons;
            if (selected_order && buttons) {
                this.active_button_cash_management(buttons);
                this.active_reprint_last_order(buttons, selected_order);
                this.active_medical_insurance(buttons, selected_order);
                this.active_button_combo(buttons, selected_order);
                this.active_button_combo_item_add_lot(buttons, selected_order);
                this.active_internal_transfer_button(buttons, selected_order);
                this.active_button_variants(buttons, selected_order);
                this.active_button_create_purchase_order(buttons, selected_order);
                this.active_button_change_unit(buttons, selected_order);
                this.active_button_set_tags(buttons, selected_order);
                this.active_lock_unlock_order(buttons, selected_order);
                this.active_button_global_discount(buttons, selected_order);
                try { // try catch because may be customer not installed pos_restaurant
                    var changes = selected_order.hasChangesToPrint();
                    if (buttons && buttons.button_kitchen_receipt_screen) {
                        buttons.button_kitchen_receipt_screen.highlight(changes);
                    }
                } catch (e) {

                }
                var $signature = $('.signature');
                if ($signature) {
                    $signature.attr('src', selected_order.get_signature());
                }
                var $note = this.el.querySelector('.order-note');
                if ($note) {
                    $note.textContent = selected_order.get_note();
                }
                var $priority = this.el.querySelector('.order-priority');
                if ($priority) {
                    if (selected_order.get_priority() == 'normal'){
                        $priority.textContent = 'Normal';
                    }

                    if (selected_order.get_priority() == 'urgente'){
                        $priority.textContent = 'Urgente';
                    }

                    if (selected_order.get_priority() == 'extraurgente'){
                        $priority.textContent = 'Extra Urgente';
                    }
                }
                var $fechahora = this.el.querySelector('.order-fechahora');
                if ($fechahora) {
                    $fechahora.textContent = selected_order.get_fechahora();
                }
                var $fechahorae = this.el.querySelector('.order-fechahorae');
                if ($fechahorae) {
                    $fechahorae.textContent = selected_order.get_fechahorae();
                }
                if (selected_order.selected_orderline) {
                    var check = selected_order.selected_orderline.is_multi_variant();
                    var buttons = this.getParent().action_buttons;
                    if (buttons && buttons.button_add_variants) {
                        buttons.button_add_variants.highlight(check);
                    }
                    var has_variants = selected_order.selected_orderline.has_variants();
                    if (buttons && buttons.button_remove_variants) {
                        buttons.button_remove_variants.highlight(has_variants);
                    }
                }
                /*
                    Header order list
                */
                var total = selected_order ? selected_order.get_total_with_tax() : 0;
                var taxes = selected_order ? total - selected_order.get_total_without_tax() : 0;
                this.set_total_taxes(taxes);
                this.set_total_items(selected_order.orderlines.length);
                this.set_amount_total(total);
                var promotion_lines = _.filter(selected_order.orderlines.models, function (line) {
                    return line.promotion;
                });
                if (promotion_lines.length > 0) {
                    this.set_total_gift(promotion_lines.length)
                }
            }
        }
    });
});
