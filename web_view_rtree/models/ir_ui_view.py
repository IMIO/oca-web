# SPDX-FileCopyrightText: 2023 Coop IT Easy SC
#
# SPDX-License-Identifier: AGPL-3.0-or-later

from odoo import fields, models


class IrUiView(models.Model):
    _inherit = "ir.ui.view"

    type = fields.Selection(
        selection_add=[("rtree", "RTree")],
        ondelete={"rtree": "cascade"},
    )

    def _get_view_info(self):
        return {"rtree": {"icon": "fa fa-folder-tree"}} | super()._get_view_info()

    def _onchange_able_view_rtree(self, node):
        return True
