"use strict";
odoo.define('pos_retail.screen_client_list', function (require) {
    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var qweb = core.qweb;
    var rpc = require('pos.rpc');
    var PopupWidget = require('point_of_sale.popups');
    var gui = require('point_of_sale.gui');    

    screens.ClientListScreenWidget.include({
        init: function (parent, options) {
            this._super(parent, options);
            var self = this;
            this.pos.bind('client:save_changes', function () {
                self.save_changes();
            });
        },
        refresh_screen: function () {
            if (!this.pos.config.big_datas) {
                return
            }
            var self = this;
            this.pos.get_modifiers_backend_all_models().done(function () {
                self.pos.trigger('refresh:partner_screen');
            });
        },
        start: function () {
            var self = this;
            this._super();
            this.pos.bind('refresh:partner_screen', function () {
                var partners = self.pos.db.get_partners_sorted(100);
                self.re_render_list(partners);
            });
        },
        re_render_list: function (partners) {
            var contents = this.$el[0].querySelector('.client-list-contents');
            contents.innerHTML = "";
            for (var i = 0, len = Math.min(partners.length, 1000); i < len; i++) {
                var partner = partners[i];
                if (!partner) {
                    continue
                }
                var clientline_html = qweb.render('ClientLine', {widget: this, partner: partner});
                var clientline = document.createElement('tbody');
                clientline.innerHTML = clientline_html;
                clientline = clientline.childNodes[1];
                this.partner_cache.cache_node(partner.id, clientline);
                if (partner === this.old_client) {
                    clientline.classList.add('highlight');
                } else {
                    clientline.classList.remove('highlight');
                }
                contents.appendChild(clientline);
            }
        },
        display_client_details: function (visibility, partner, clickpos) { // TODO: we add input type date to box birth day of client edit
            var self = this;
            if (partner) {
                var orders = this.pos.db.get_pos_orders().filter(function (order) {
                    return order.partner_id && order.partner_id[0] == partner['id']
                });
                partner.orders_count = orders.length;
            }
            this._super(visibility, partner, clickpos);
            this.$("input[name='birthday_date']").datetimepicker({
                format: 'DD-MM-YYYY',
                calendarWeeks: true,
                icons: {
                    time: 'fa fa-clock-o',
                    date: 'fa fa-calendar',
                    next: 'fa fa-chevron-right',
                    previous: 'fa fa-chevron-left',
                    up: 'fa fa-chevron-up',
                    down: 'fa fa-chevron-down',
                    close: 'fa fa-times',
                },
                // locale: moment.locale(),
            });
            if (visibility == 'show' && partner) {
                this.el.querySelector('.purchased-histories').addEventListener('click', function (event) {
                    self.pos.show_purchased_histories(partner);
                })
            }
        },
        show: function () {
            var self = this;
            this.search_partners = [];
            this._super();
            this.refresh_screen();
            var $search_box = $('.clientlist-screen .searchbox >input');
            $search_box.autocomplete({
                source: this.pos.db.get_partners_source(),
                minLength: this.pos.config.min_length_search,
                select: function (event, ui) {
                    if (ui && ui['item'] && ui['item']['value']) {
                        var partner = self.pos.db.partner_by_id[parseInt(ui['item']['value'])];
                        if (partner) {
                            self.pos.get_order().set_client(partner);
                            self.pos.gui.back();
                        }
                        setTimeout(function () {
                            self.clear_search()
                        }, 2000);

                    }
                }
            });
            this.$('.only_customer').click(function () {
                self.pos.only_customer = !self.pos.only_customer;
                self.pos.only_supplier = !self.pos.only_customer;
                if (self.pos.only_customer) {
                    self.$('.only_customer').addClass('highlight');
                    self.$('.only_supplier').removeClass('highlight');
                } else {
                    self.$('.only_customer').removeClass('highlight');
                    self.$('.only_supplier').addClass('highlight');
                }
                var partners = self._get_partners();
                self.render_list(partners);
            });
            this.$('.only_supplier').click(function () {
                self.pos.only_supplier = !self.pos.only_supplier;
                self.pos.only_customer = !self.pos.only_supplier;
                if (self.pos.only_supplier) {
                    self.$('.only_supplier').addClass('highlight');
                    self.$('.only_customer').removeClass('highlight');
                } else {
                    self.$('.only_supplier').removeClass('highlight');
                    self.$('.only_customer').addClass('highlight');
                }
                var partners = self._get_partners();
                self.render_list(partners);
            });
            this.$('.back').click(function () {
                self.pos.trigger('back:order');
            });
            this.$('.next').click(function () {
                self.pos.trigger('back:order');
            });
            this.$('.sort_by_id').click(function () {
                if (self.search_partners.length == 0) {
                    var partners = self._get_partners().sort(self.pos.sort_by('id', self.reverse, parseInt));
                    self.render_list(partners);
                    self.reverse = !self.reverse;
                } else {
                    self.search_partners = self.search_partners.sort(self.pos.sort_by('id', self.reverse, parseInt));
                    self.render_list(self.search_partners);
                    self.reverse = !self.reverse;
                }
            });
            this.$('.sort_by_name').click(function () {
                if (self.search_partners.length == 0) {
                    var partners = self._get_partners().sort(self.pos.sort_by('name', self.reverse, function (a) {
                        if (!a) {
                            a = 'N/A';
                        }
                        return a.toUpperCase()
                    }));
                    self.render_list(partners);
                    self.reverse = !self.reverse;
                } else {
                    self.search_partners = self.search_partners.sort(self.pos.sort_by('name', self.reverse, function (a) {
                        if (!a) {
                            a = 'N/A';
                        }
                        return a.toUpperCase()
                    }));
                    self.render_list(self.search_partners);
                    self.reverse = !self.reverse;
                }
            });
            this.$('.sort_by_address').click(function () {
                if (self.search_partners.length == 0) {
                    var partners = self._get_partners().sort(self.pos.sort_by('name', self.reverse, function (a) {
                        if (!a) {
                            a = 'N/A';
                        }
                        return a.toUpperCase()
                    }));
                    self.render_list(partners);
                    self.reverse = !self.reverse;
                } else {
                    self.search_partners = self.search_partners.sort(self.pos.sort_by('name', self.reverse, function (a) {
                        if (!a) {
                            a = 'N/A';
                        }
                        return a.toUpperCase()
                    }));
                    self.render_list(self.search_partners);
                    self.reverse = !self.reverse;
                }
            });
            this.$('.sort_by_phone').click(function () {
                if (self.search_partners.length == 0) {
                    var partners = self._get_partners().sort(self.pos.sort_by('phone', self.reverse, function (a) {
                        if (!a) {
                            a = 'N/A';
                        }
                        return a.toUpperCase()
                    }));
                    self.render_list(partners);
                    self.reverse = !self.reverse;
                } else {
                    self.search_partners = self.search_partners.sort(self.pos.sort_by('phone', self.reverse, function (a) {
                        if (!a) {
                            a = 'N/A';
                        }
                        return a.toUpperCase()
                    }));
                    self.render_list(self.search_partners);
                    self.reverse = !self.reverse;
                }
            });
            this.$('.sort_by_mobile').click(function () {
                if (self.search_partners.length == 0) {
                    var partners = self._get_partners().sort(self.pos.sort_by('mobile', self.reverse, function (a) {
                        if (!a) {
                            a = 'N/A';
                        }
                        return a.toUpperCase()
                    }));
                    self.render_list(partners);
                    self.reverse = !self.reverse;
                } else {
                    self.search_partners = self.search_partners.sort(self.pos.sort_by('mobile', self.reverse, function (a) {
                        if (!a) {
                            a = 'N/A';
                        }
                        return a.toUpperCase()
                    }));
                    self.render_list(self.search_partners);
                    self.reverse = !self.reverse;
                }
            });
        },
        _get_partners: function () {
            if (this.partners_list) {
                return this.partners_list
            } else {
                return this.pos.db.get_partners_sorted(1000)
            }
        },
        render_list: function (partners) {
            if (this.pos.only_customer) {
                var partners = _.filter(partners, function (partner) {
                    return partner['customer'] == true;
                });
                return this._super(partners);
            }
            if (this.pos.only_supplier) {
                var partners = _.filter(partners, function (partner) {
                    return partner['supplier'] == true;
                });
                return this._super(partners);
            }
            this.partners_list = partners;
            return this._super(partners);
        },
        clear_search: function () {
            return this._super();
        },
        save_client_details: function (partner) {
            var id = partner.id || false;
            var fields = {};
            this.$('.client-details-contents .detail').each(function (idx, el) {
                fields[el.name] = el.value || false;
            });
            if (!fields['name']) {
                return this.wrong_input('input[name="name"]', '(*) Field name is required');
            } else {
                this.passed_input('input[name="name"]');
            }
            if (fields['phone']) {
                var is_phone = this.check_is_number(fields['phone']);
                if (!is_phone) {
                    return this.wrong_input('input[name="phone"]', '(*) Field phone is not a number');
                }
            } else {
                this.passed_input('input[name="phone"]');
            }
            if (fields['mobile']) {
                var is_mobile = this.check_is_number(fields['mobile']);
                if (!is_mobile) {
                    return this.wrong_input('input[name="mobile"]', '(*) Field mobile is not a number');
                }
            } else {
                this.passed_input('input[name="mobile"]');
            }
            if(!fields['email']){
                return this.wrong_input('input[name="email"]','(*) Field Email is required');
            }else{
                if (this.pos.config.check_duplicate_email && fields['email']) {
                var is_duplicated = this._check_is_duplicate(fields['email'], 'email', id);
                if (is_duplicated) {
                    return this.wrong_input('input[name="email"]', '(*) Field email is unique, this email used another client');
                } else {
                    this.passed_input('input[name="email"]');
                }
            }
            }
            if (this.pos.config.check_duplicate_phone && fields['phone']) {
                var is_duplicated = this._check_is_duplicate(fields['phone'], 'phone', id);
                if (is_duplicated) {
                    return this.wrong_input('input[name="phone"]', '(*) Field phone is unique, this phone used another client');
                } else {
                    this.passed_input('input[name="phone"]');
                }
            }
            if (this.pos.config.check_duplicate_phone && fields['mobile']) {
                var is_duplicated = this._check_is_duplicate(fields['mobile'], 'mobile', id);
                if (is_duplicated) {
                    return this.wrong_input('input[name="mobile"]', '(*) Field mobile is unique, this mobile used another client');
                } else {
                    this.passed_input('input[name="mobile"]');
                }
            }
            return this._super(partner);
        },
        saved_client_details: function (partner_id) {
            var self = this;
            this.reload_partners(partner_id).then(function () {
                var partner = self.pos.db.get_partner_by_id(partner_id);
                if (partner) {
                    self.new_client = partner;
                    self.toggle_save_button();
                    self.display_client_details('show', partner);
                } else {
                    // should never happen, because create_from_ui must return the id of the partner it
                    // has created, and reload_partner() must have loaded the newly created partner.
                    self.display_client_details('hide');
                }
            }).always(function () {
                $(".client-details-contents").on('click', '.button.save', function () {
                    if (self.new_client) {
                        self.save_client_details(self.new_client);
                    }
                });
            });
        },
        reload_partners: function (partner_id) {
            var self = this;
            return this.pos.load_new_partners(partner_id).then(function () {
                self.partner_cache = new screens.DomCache();
                self.render_list(self._get_partners());
                var curr_client = self.pos.get_order().get_client();
                if (curr_client) {
                    self.pos.get_order().set_client(self.pos.db.get_partner_by_id(curr_client.id));
                }
            });
        },
    });

});
