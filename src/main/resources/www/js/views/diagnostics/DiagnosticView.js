/** Copyright 2013-2019 NetFishers */
define([
	'jquery',
	'underscore',
	'backbone',
	'ace/ace',
	'text!templates/diagnostics/diagnostic.html',
	'views/diagnostics/EditSimpleDiagnosticDialog',
	'views/diagnostics/EditJsDiagnosticDialog'
], function($, _, Backbone, ace, diagnosticTemplate, EditSimpleDiagnosticDialog,
		EditJsDiagnosticDialog) {

	return Backbone.View.extend({

		el: "#nsdiagnostics-diagnostic",

		template: _.template(diagnosticTemplate),
		
		initialize: function(options) {
			var that = this;
			this.deviceTypes = options.deviceTypes;
			this.deviceType = this.deviceTypes.findWhere({
				name: this.model.get("deviceDriver")
			});
			this.render();
		},

		render: function() {
			var that = this;
			var data = this.model.toJSON();

			this.$el.html(this.template(data));

			if (!user.isExecuteReadWrite()) {
				this.$("#diagnosticedit").remove();
			}

			this.$("#diagnosticedit").button({
				icons: {
					primary: "ui-icon-pencil"
				},
			}).click(function() {
				var EditDiagnosticDialog = EditSimpleDiagnosticDialog;
				if (that.model.get('type') === ".JsDiagnostic") {
					EditDiagnosticDialog = EditJsDiagnosticDialog;
				}
				var editDialog = new EditDiagnosticDialog({
					model: that.model,
					onEdited: function() {
						that.options.onEdited();
					}
				});
			});

			if (this.model.get('type') === ".JsDiagnostic") {
				this.scriptEditor = ace.edit('nsdiagnostics-diagnostic-script');
				this.scriptEditor.getSession().setMode("ace/mode/javascript");
				this.scriptEditor.setReadOnly(true);
				this.scriptEditor.setValue(that.model.get("script"));
				this.scriptEditor.setHighlightActiveLine(false);
				this.scriptEditor.renderer.setShowGutter(false);
				this.scriptEditor.gotoLine(1);
			}

			return this;
		},

		destroy: function() {
			if (this.scriptEditor) {
				this.scriptEditor.destroy();
			}
			this.$el.html("");
		}

	});
});