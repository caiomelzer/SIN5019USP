bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.activity.sidebar",{},{init:function(t,e,i,a){var r=this;r._super(t,e,a),r.serviceloadDataPlan=i,r.loadTemplates({"project-plan-activity-sidebar":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.sidebar").concat("#project-plan-activity-sidebar")})},renderContent:function(){var t=this,e=t.getTemplate("project-plan-activity-sidebar");return t.content=e.render({}),t.content},postRender:function(){var t=this;t.sub("LOAD_INFO_PLAN",$.proxy(t.onNotifyLoadInfoPlan,t))},onNotifyLoadInfoPlan:function(t,e){var i=this;if(i.params.plan.idActivitySelected){var a={idPlan:i.params.plan.id};i.serviceloadDataPlan.loadData(a,i.getDateServer,i.params),i.serviceloadDataPlan.subscribe("loadedWithDataActivities",$.proxy(i.loadedWithDataActivities,i)),i.serviceloadDataPlan.subscribe("loadedWithDataFirstParent",$.proxy(i.loadedWithDataFirstParent,i))}else"ACTIVITYPLANPROCESSMAP"!==i.params.showContextByMenuDashboard&&"ACTIVITYPLANLOG"!==i.params.showContextByMenuDashboard||i.pub("notify",{type:"DISABLED_RIGHT_SIDEBAR"})},loadedWithDataActivities:function(){var t=this;t.pub("notify",{type:"LOADED_ACTIVITIES_PLAN",args:t.params}),t.pub("notify",{type:"LOAD_INFO_SUMMARY_PROGRESS_PLAN",args:t.params}),t.pub("notify",{type:"LOAD_INFO_ACTIVITY_SUMMARY",args:t.params}),t.pub("notify",{type:"LOAD_INFO_ACTIVITIES_PLAN",args:t.params})},loadedWithDataFirstParent:function(){this.pub("notify",{type:"LOAD_INFO_SUMMARY_PLAN",args:this.params})},clean:function(){var t=this;t.serviceloadDataPlan&&(t.serviceloadDataPlan.unsubscribe("loadedWithDataActivities",$.proxy(t.loadedWithDataActivities,t)),t.serviceloadDataPlan.unsubscribe("loadedWithDataFirstParent",$.proxy(t.loadedWithDataFirstParent,t)))}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.sidebar",["workportalFacade","dataService","bizagi.workportal.services.behaviors.loadDataPlan",bizagi.workportal.widgets.project.plan.activity.sidebar],!0),bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.activity.action",{},{init:function(t,e,i,a){var r=this;r._super(t,e,a),r.dateFormat=bizagi.localization.getResource("dateFormat"),r.timeFormat=bizagi.localization.getResource("timeFormat"),r.estimatedFinishDateTime,r.beforeUserAssignedActivity="",r.notifier=i,r.loadTemplates({"activity-action-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.action").concat("#project-plan-activity-action"),"activity-action-editionpopup":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.action").concat("#project-plan-activity-action-editionpopup")}),r.dialogBox={}},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){var t=this;t.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(t.onNotifyLoadInfoActivityExecution,t)),t.sub("EXPANDED_RIGHT_SIDEBAR",$.proxy(t.onNotifyExpandedRightSidebar,t))},onNotifyLoadInfoActivityExecution:function(t,e){var i=this;i.params=$.extend(i.params,e.args);var a=i.getContent().empty(),r={};if(i.params.plan.idActivitySelected&&(r=i.params.plan.activities.filter(function(t){return t.id.toUpperCase()===i.params.plan.idActivitySelected.toUpperCase()})[0]),i.params.plan.idUserCreator===bizagi.currentUser.idUser||r.userAssigned==bizagi.currentUser.idUser){var o={};o.currentActivityName=r.name,o.showEditAction=!0,i.params.plan.idUserCreator!==bizagi.currentUser.idUser&&(o.showEditAction=!1);var n=i.getTemplate("activity-action-main");a.append(n.render(o)),o.showEditAction&&(i.initilizeActionMenu(),i.beforeUserAssignedActivity=r.userAssigned,i.content.append(a),i.initializeTempleteAndEvents())}},initializeTempleteAndEvents:function(){var t=this;t.plugins={},t.plugins.activityEdition=t.initPluginPopupEdition(),t.formEditActivity={assignee:$("#activity-form-assignee",t.plugins.activityEdition),date:$("#activity-form-date",t.plugins.activityEdition),duration:$("#activity-form-duration",t.plugins.activityEdition),buttonCancel:$("#ui-bizagi-wp-project-popupform-action-cancel",t.plugins.activityEdition),buttonUpdate:$("#ui-bizagi-wp-project-popupform-action-update",t.plugins.activityEdition)},t.formEditActivity.buttonCancel.on("click",$.proxy(t.onClickPopupButtonCancel,t)),t.formEditActivity.buttonUpdate.on("click",$.proxy(t.onClickPopupButtonUpdate,t)),t.formEditActivity.date.on("keydown",$.proxy(t.onDeleteDate,t)),t.formEditActivity.duration.on("keyup",$.proxy(t.onTypeDuration,t))},onNotifyExpandedRightSidebar:function(){this.initilizeActionMenu()},initilizeActionMenu:function(){var t=this;$("#ui-bizagi-wp-project-plan-activity-action .menu",t.content).menu({select:$.proxy(t.onSelectMenu,t)}).removeClass("ui-widget-content")},initPluginPopupEdition:function(){var t=this,e=t.getTemplate("activity-action-editionpopup");return t.dialogBox.formContent=e.render({}),t.dialogBox.formContent},initializeAutoComplete:function(t){var e=this,i=e.dataService.serviceLocator.getUrl("admin-getUsersList");t.autocomplete({minLength:2,source:function(t,e){$.ajax({url:i,data:{domain:"",userName:"",fullName:t.term,organization:"",pag:1,pagSize:100,orderField:"fullName"},success:function(t){e($.map(t.users,function(t){return{label:t.user,value:t.idUser}}))}})},select:function(i,a){var r=a.item.label;return t.val(r),e.formEditActivity.IdAssignee=a.item.value,!1},focus:function(){return!1},change:function(t,i){return null===i.item&&(e.formEditActivity.IdAssignee=null,e.formEditActivity.assignee.val("")),!1}})},initializeDatePicker:function(t){var e=this;t.datepicker({onSelect:function(){e.formEditActivity.duration.val(""),e.estimatedFinishDateTime=e.formEditActivity.date.datepicker("getDate")?e.formEditActivity.date.datepicker("getDate").getTime():void 0}}),t.datepicker("option","dateFormat",bizagi.util.dateFormatter.getDateFormatByDatePickerJqueryUI())},initializeSpiner:function(t){var e=this;function i(t,i){var a=i||$(t.target).val();bizagi.util.isNumeric(a)&&parseInt(a,10)>0?(e.formEditActivity.date.val(""),e.estimatedFinishDateTime=void 0):$(t.target).val("")}t.spinner({min:1,max:1e3,placeHolder:bizagi.localization.getResource("workportal-hours"),change:function(t){i(t)},spin:function(t,e){i(t,e.value)}})},onDeleteDate:function(t){8===t.keyCode&&($(t.target).val(""),this.fieldDurationActive(!0))},onTypeDuration:function(t){""!==$(t.target).val()?this.estimatedFinishDateTime=void 0:this.activateElement(this.form.date)},onSelectMenu:function(t,e){if(0===$(t.currentTarget).find("i").length)switch($(e.item).data("item")){case"edit":this.onClickOpenPopupEdition()}},onClickOpenPopupEdition:function(){var t=this;t.initializeTempleteAndEvents(),t.dialogBox.formContent.dialog({resizable:!1,draggable:!1,height:"auto",width:"600px",modal:!0,title:bizagi.localization.getResource("workportal-project-plan-title-activity-properties"),maximize:!0,open:$.proxy(t.onOpenPopupEdition,t),close:$.proxy(t.onClosePopupEdition,t)})},onOpenPopupEdition:function(){var t=this,e=t.params.plan.activities.filter(function(e){return e.id.toUpperCase()===t.params.plan.idActivitySelected.toUpperCase()})[0],i=e&&!bizagi.util.isEmpty(e.estimatedFinishDate)?e.estimatedFinishDate:"";isNaN(i)||(i=bizagi.util.dateFormatter.formatInvariant(new Date(i)));var a=i?bizagi.util.dateFormatter.getDateFromInvariant(i):"",r=a instanceof Date&&a.getTime()<t.getDateServer();t.initializeAutoComplete(t.formEditActivity.assignee),t.initializeDatePicker(t.formEditActivity.date),t.initializeSpiner(t.formEditActivity.duration),e.userAssigned&&t.setUserAssignedById(e.userAssigned),t.formEditActivity.date.datepicker("option","minDate",new Date(t.getDateServer())),e.estimatedFinishDate&&r&&t.formEditActivity.date.datepicker("option","minDate",a),e.estimatedFinishDate&&(a&&t.formEditActivity.date.datepicker("setDate",a),t.estimatedFinishDateTime=e.estimatedFinishDate),e.duration&&t.formEditActivity.duration.val(parseInt(e.duration,10))},onClosePopupEdition:function(){this.removePopupWidgets()},setUserAssignedById:function(t){var e=this;e.callGetDataUsers(t).then(function(t){e.formEditActivity.assignee.val(t[0].name)}),e.formEditActivity.IdAssignee=t},onClickPopupButtonCancel:function(t){t.preventDefault(),this.removePopupWidgets()},removePopupWidgets:function(){this.formEditActivity.assignee.next().find("span").html(""),this.dialogBox.formContent.remove(),$("#ui-datepicker-div").remove()},onClickPopupButtonUpdate:function(){var t=this;if(t.validateParamsOfFormEditActivity()){var e=t.params.plan.activities.filter(function(e){return e.id.toUpperCase()===t.params.plan.idActivitySelected.toUpperCase()})[0],i=t.formEditActivity.IdAssignee||bizagi.currentUser.idUser;""!=t.formEditActivity.duration.val()&&(t.params.plan.activities.filter(function(e){return e.id.toUpperCase()===t.params.plan.idActivitySelected.toUpperCase()})[0].estimatedFinishDate="");var a={progress:e.progress,id:e.id,startDate:e.startDate,duration:t.formEditActivity.duration.val(),userAssigned:i,allowEdition:e.allowEdition,description:e.description,name:e.name,idPlan:e.idPlan,estimatedFinishDate:t.estimatedFinishDateTime,finishDate:e.finishDate,items:e.items};$.when(t.dataService.editActivityPlan(a)).done(function(){e=$.extend(e,a),t.removePopupWidgets(),t.beforeUserAssignedActivity!==t.formEditActivity.IdAssignee?t.pub("notify",{type:"ACTIVITYPLANCOMMENTS",args:$.extend(t.params,{refreshAllWidgets:!0})}):t.pub("notify",{type:t.params.showContextByMenuDashboard,args:t.params}),t.removePopupWidgets(),t.notifier.showSucessMessage(bizagi.localization.getResource("workportal-project-plan-activity-update-message"))})}},onClickFavorite:function(t){t.preventDefault();var e=this,i={};$(t.target).hasClass("bz-icon-star-outline")?(i={idObject:e.params.idCase,favoriteType:"CASES"},$.when(e.dataService.addFavorite(i)).done(function(i){e.params.guidFavorite=i.idFavorites,$(t.target).removeClass("bz-icon-star-outline"),$(t.target).addClass("bz-icon-star")})):(i={idObject:e.params.guidFavorite,favoriteType:"CASES"},$.when(e.dataService.delFavorite(i)).done(function(){$(t.target).addClass("bz-icon-star-outline"),$(t.target).removeClass("bz-icon-star")}))},clean:function(){var t=this;t.unsub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(t.onNotifyLoadInfoActivityExecution,t)),t.unsub("EXPANDED_RIGHT_SIDEBAR",$.proxy(t.onNotifyExpandedRightSidebar,t))},validateParamsOfFormEditActivity:function(){var t=this.formEditActivity.assignee;if(t.val()&&""!==t.val()&&this.formEditActivity.IdAssignee)return!0;var e=bizagi.localization.getResource("workportal-general-error-field-required");return e=e.replace("{0}",bizagi.localization.getResource("workportal-project-plan-assignee").toLowerCase()),t.next().find("span").html(e),!1},callGetDataUsers:function(t){var e=$.Deferred(),i={userIds:t,width:50,height:50};return this.dataService.getUsersData(i).always(function(t){e.resolve(t)}),e.promise()}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.action",["workportalFacade","dataService","notifier",bizagi.workportal.widgets.project.plan.activity.action]),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.time",{},{init:function(t,e,i){var a=this;a._super(t,e,i),a.EXECUTING_ACTIVITY="EXECUTING",a.FINISHED_ACTIVITY="FINISHED",a.datePickerRegional=bizagi.localization.getResource("datePickerRegional"),a.loadTemplates({"plan-time-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.time").concat("#project-plan-activity-time")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){this.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(this.onNotifyLoadInfoActivitySummary,this))},onNotifyLoadInfoActivitySummary:function(t,e){var i=this;i.params=$.extend(i.params,e.args),i.getContent().empty();var a=i.params.plan.activities.filter(function(t){return t.id===i.params.plan.idActivitySelected})[0];if(a.startDate){i.getStateActivity(a);var r={time:{fromDate:i.getFormattedDate(new Date(i.getFirstDate(a)))}},o=i.getDataByScenarios(a,!0);$.when(o.unitTime).done(function(t){o=$.extend(o,{unitTime:t}),i.updateWidget($.extend(r.time,o))})}},updateWidget:function(t){var e=this.getContent().empty(),i=this.getTemplate("plan-time-main"),a=bizagi.util.dateFormatter.getRelativeTime(new Date(Date.now()-60*t.unitTime.minutes*1e3),null,!1),r=bizagi.localization.getResource("workportal-project-activity-state-"+t.keywordResource);t.messageTime=r.replace("%s",a),i.render(t).appendTo(e);var o=$(".remaining-days .time-remaining",e),n=$(".remaining-days .days",e).width();o.css("padding-left",(n+7).toString()+"px"),$(".remaining-days .bar-completed",e).css("width",t.percentBar+"%")},getStateActivity:function(t){return t.finishDate?(t.currentState=this.FINISHED_ACTIVITY,this.FINISHED_ACTIVITY):(t.currentState=this.EXECUTING_ACTIVITY,this.EXECUTING_ACTIVITY)},getFirstDate:function(t){return t.currentState===this.EXECUTING_ACTIVITY?t.startDate:t.finishDate},getDataByScenarios:function(t){var e=this,i={colorBar:null,percentBar:100,keywordResource:null,unitTime:null},a={};switch(t.currentState){case e.EXECUTING_ACTIVITY:i.keywordResource="opened",i.colorBar=e.getColorByCreatedAndEstimatedDate(t),a={idUser:bizagi.currentUser.idUser,fromDate:t.startDate,toDate:Date.now()},i.unitTime=e.callGetEffectiveDuration(a);break;case e.FINISHED_ACTIVITY:i.colorBar="Gray",i.keywordResource="closed",a={idUser:bizagi.currentUser.idUser,fromDate:t.finishDate,toDate:Date.now()},i.unitTime=e.callGetEffectiveDuration(a)}return i},getColorBar:function(t){return this.getDataByScenarios(t).colorBar},getPercentBar:function(t){return this.getDataByScenarios(t).percentBar},getKeywordResourceDescriptionBar:function(t){return this.getDataByScenarios(t).keywordResource},getUnitTime:function(t){return this.getDataByScenarios(t).unitTime},getColorByCreatedAndEstimatedDate:function(t){var e="Red";t.estimatedFinishDate&&(Date.now()<t.estimatedFinishDate&&(e=(new Date).getUTCDate()===new Date(t.estimatedFinishDate).getUTCDate()?"Yellow":"Green"));return e},getFormattedDate:function(t){return this.datePickerRegional.monthNames[t.getMonth()]+" "+bizagi.util.dateFormatter.formatDate(t,"dd hh:mm tt",bizagi.localization.getResource("datePickerRegional"))},callGetEffectiveDuration:function(t){var e=$.Deferred();return $.when(this.dataService.getEffectiveDuration(t)).done(function(t){e.resolve(t)}),e.promise()}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.time",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.time],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.progress",{},{init:function(t,e,i){this._super(t,e,i),this.plugins={},this.dialogBox={},this.loadTemplates({"plan-progress-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.progress").concat("#project-plan-activity-progress"),"plan-progress-popup-edit":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.progress").concat("#project-plan-activity-edit-progress")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){var t=this;t.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(t.onNotifyLoadInfoActivityExecution,t)),t.sub("UPDATE_ITEMS_FROM_FORMRENDER",$.proxy(t.onNotifyUpdateItemFromRender,t))},onNotifyLoadInfoActivityExecution:function(t,e){var i=this;i.params=$.extend(i.params,e.args);var a=i.getContent().empty(),r=i.params.plan.activities.filter(function(t){return t.id.toUpperCase()==i.params.plan.idActivitySelected.toUpperCase()})[0],o={valuePercentBarComplete:0};o.progress={progress:r.progress,canEdit:0===r.items.length},o.progress.progress&&(o.valuePercentBarComplete=o.progress.progress),i.getTemplate("plan-progress-main").render(o).appendTo(a),i.plugins.popupEditProgress=i.initPluginPopupEditProgress();var n=i.plugins.popupEditProgress;i.formEditProgress={sliderProgress:$("#sliderProgress",n).slider({orientation:"horizontal",range:"min",max:100,width:100,from:5,to:50,step:1,value:o.valuePercentBarComplete,slide:$.proxy(i.onChangesliderProgress,i),change:$.proxy(i.onChangesliderProgress,i)}).each(function(){for(var t=$(this).slider("option","max")-$(this).slider("option","min"),e=0;e<=t;e+=10){var i=$("<label class='step'>"+e+"</label>").css("left",e/t*100+"%");$(this).append(i)}}),numericTextBoxPlugin:$("#inputProgressNumericTextBox",n).spinner({format:"n0",min:0,max:100,spin:$.proxy(i.onChangeNumericTextBoxProgress,i),change:$.proxy(i.onChangeNumericTextBoxProgress,i),value:o.valuePercentBarComplete,decimals:0}),buttonChangeProgress:$("#button-accept-change-progress",n),buttonCancel:$("#button-cancel-change-progress",n)},$(".action-open-popup-edit-progress",a).on("click",$.proxy(i.onShowPopupEditProgress,i)),i.formEditProgress.buttonCancel.on("click",$.proxy(i.onClickCancel,i)),i.formEditProgress.buttonChangeProgress.on("click",$.proxy(i.onSubmitFormChangeProgress,i)),i.updateProgressUI(o.valuePercentBarComplete),i.formEditProgress.numericTextBoxPlugin.spinner("value",o.valuePercentBarComplete)},onNotifyUpdateItemFromRender:function(t,e){var i=e.args.items,a=e.args.activityWork;i.length>0?$(".action-open-popup-edit-progress",this.content).hide():$(".action-open-popup-edit-progress",this.content).show(),$(".bz-wp-timestamp span",this.content).text(a),$(".bz-wp-progress-bar",this.content).css("width",a+"%")},updateProgressUI:function(t){var e=this.getContent();$(".bz-wp-timestamp span",e).text(t);var i=$(".remaining-days .time-remaining",e),a=$(".remaining-days .days",e).width();i.css("padding-left",(a+7).toString()+"px"),$(".remaining-days .bar-completed",e).css("width",t.toString()+"%")},initPluginPopupEditProgress:function(){var t=this.getTemplate("plan-progress-popup-edit");return this.dialogBox.formContent=t.render(),this.dialogBox.formContent},onShowPopupEditProgress:function(){var t=this;t.dialogBox.formContent.dialog({resizable:!1,draggable:!1,height:"auto",width:"600px",modal:!0,title:bizagi.localization.getResource("workportal-project-plan-progress-title"),maximize:!0,open:$.proxy(t.onOpenPopupPlan,t),close:function(){t.dialogBox.formContent.dialog("destroy"),t.dialogBox.formContent.detach()}}),t.previusValueProgress=t.formEditProgress.sliderProgress.slider("value")},onChangeNumericTextBoxProgress:function(t){var e=this.formEditProgress.numericTextBoxPlugin.spinner("value");this.formEditProgress.sliderProgress.slider("value",e)},onChangesliderProgress:function(t){var e=this.formEditProgress.sliderProgress.slider("value");this.formEditProgress.numericTextBoxPlugin.spinner("value",e)},onClickCancel:function(t){t.preventDefault();var e=this;e.dialogBox.formContent.dialog("destroy"),e.dialogBox.formContent.detach(),e.formEditProgress.sliderProgress.slider("value",e.previusValueProgress),e.formEditProgress.numericTextBoxPlugin.spinner("value",e.previusValueProgress)},onSubmitFormChangeProgress:function(t){t.preventDefault();var e=this;e.formEditProgress.buttonChangeProgress.prop("disabled",!0);var i=e.params.plan.activities.filter(function(t){return t.id==e.params.plan.idActivitySelected})[0],a=$.extend(i,{progress:e.formEditProgress.numericTextBoxPlugin.spinner("value"),idPlan:e.params.plan.id});$.when(e.dataService.editActivityPlan(a)).done(function(){e.formEditProgress.buttonChangeProgress.prop("disabled",!1),i.progress=e.formEditProgress.numericTextBoxPlugin.spinner("value"),e.updateProgressUI(i.progress),e.dialogBox.formContent.dialog("destroy"),e.dialogBox.formContent.detach()})}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.progress",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.progress],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.subprocesses",{},{init:function(t,e,i){this._super(t,e,i),this.loadTemplates({"project-subprocesses":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.subprocesses").concat("#project-plan-activity-plan-subprocesses-wrapper"),"project-subprocesses-tootip-custom-properties":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.subprocesses").concat("#project-activity-plan-subprocesses-tooltip-custom-properties-wrapper")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.subprocesses",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.subprocesses]),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.parent",{},{init:function(t,e,i){this._super(t,e,i),this.loadTemplates({"plan-parent-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.parent").concat("#project-plan-activity-parent")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){this.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(this.onNotifyLoadInfoActivityExecution,this))},onNotifyLoadInfoActivityExecution:function(t,e){var i=this;i.params=$.extend(i.params,e.args);var a=i.getContent().empty();$.when(i.dataService.getPlanParent({idPlan:i.params.plan.id})).done(function(t){if(i.params.plan.parent=t,i.params.plan.parent){var e={};e.parent={idParent:i.params.plan.parent.radNumber,nameParent:i.params.plan.parent.displayName,idCase:i.params.plan.parent.idCase,idWorkflow:i.params.plan.parent.idWorkflow,idWorkItem:i.params.plan.parent.idWorkItem,idTask:i.params.plan.parent.idTask},i.getTemplate("plan-parent-main").render(e).appendTo(a),$("#go-to-parent-case",a).on("click",$.proxy(i.onClickGoToParentCase,i))}})},onClickGoToParentCase:function(t){t.preventDefault();this.routingExecute($(t.target).closest("#go-to-parent-case"))}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.parent",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.parent],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.users",{},{init:function(t,e,i){var a=this;a.usersMap={},a.plugins={},a.usersInformation=[],a.globalHandlersService=bizagi.injector.get("globalHandlersService"),a.usersAssignees=[],a._super(t,e,i),a.loadTemplates({"plan-users-main":bizagi.getTemplate("bizagi.workportal.desktop.project.plan.users").concat("#project-plan-users")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){this.sub("LOAD_INFO_ACTIVITY_SUMMARY",$.proxy(this.onNotifyLoadInfoActivityExecution,this))},activityRuning:function(t){return null!==t.startDate&&null===t.finishDate},onNotifyLoadInfoActivityExecution:function(t,e){var i=this,a=[],r=[],o=i.getContent().empty();i.params=$.extend(i.params,e.args);var n=i.params.plan.idUserCreator,s=i.params.plan.idUserCreator;r.push({idUser:n,guidUser:s,userType:["owner"]}),i.usersMap["-"+n+"-"]={picture:"",id:n,guid:s,name:"",userType:["owner"]},a.push(s),$.each(i.params.plan.activities,function(t,e){if(i.activityRuning(e)){var o=e.userAssigned,s=e.userAssignedGuid;if(o===n)-1===$.inArray("Assigned",r[0].userType)&&(r[0].userType.push("Assigned"),i.usersMap["-"+n+"-"].userType.push("Assigned"));else if(i.usersMap["-"+o+"-"]={picture:"",id:o,name:"",userType:["Assigned"]},0===r.filter(function(t){return t.idUser==o}).length){var p=s||o;r.push({idUser:p,userGuid:p,userType:["Assigned"]}),a.push(p)}}}),i.activitiesUsers=r,i.getTemplate("plan-users-main").render({assignee:i.justAssignees(r),label:bizagi.localization.getResource("workportal-project-plan-assignee")}).appendTo(o),i.addEventHandlersModal(),$.when(i.callGetDataUsers(a)).then(function(){i.showCreatorInformation(n),i.renderUserProfilesAndImages()})},justAssignees:function(t){var e=[];return t.map(function(t){var i=-1!==t.userType.indexOf("owner"),a=-1!==t.userType.indexOf("Assigned");e.push(usersAdapter.createJsonUserInfo(t.idUser,"","","","","",a,i,[],[]))}),usersAdapter.justAssignees(e)},showCreatorInformation:function(t){var e=this.usersMap["-"+t+"-"],i=usersAdapter.createJsonUserInfo(e.id,e.name,e.username,e.picture?e.picture:void 0,e.email,e.name.getInitials(),!1,!0,[],[]);this.content.find(".ui-bizagi-wp-project-plan-users .ui-bizagi-wp-project-users-creator-info").userinformation(this,{user:i})},renderUserProfilesAndImages:function(){var t=this;$.each(t.usersMap,function(e,i){var a=$(".ui-bizagi-wp-userlist li[data-iduser="+i.id+"]",t.content);""!==i.picture?a.find("img").prop("src",i.picture):(a.find("img").hide(),void 0!==i.name?a.find("span").html(i.name.getInitials()):console.log("obj.name is undefined"))}),$(".ui-bizagi-wp-userlist li",t.content).not(".moreUsers").on("mouseenter",function(e){var i,a=$(e.target),r=$(this).data("iduser");$.each(t.usersMap,function(t,e){e.id===r&&(i=e)});var o=t.usersAssignees.find(function(t){return t.userAssigned===i.id}),n=[];o&&o.activities.map(function(t){n.push(t.name)});var s=usersAdapter.createJsonUserInfo(i.id,i.name,i.username,i.picture,i.email,i.name.getInitials(),t.getIsAssignee(i),t.getIsOwner(i),n,void 0);a.parent().usertooltip(t,{target:a,user:s})})},getIsAssignee:function(t){return t.userType.indexOf("Assigned")>-1},getIsOwner:function(t){return t.userType.indexOf("owner")>-1},callGetDataUsers:function(t){var e,i=this,a=$.Deferred();return e={usersGuids:t.join(),width:50,height:50},$.when(i.dataService.getUsersData(e)).always(function(t){i.usersInformation=t;for(var e=0,r=t.length;e<r;e+=1)void 0===t[e].name?bizagi.log(t[e]+" Id Not Found",t,"error"):i.usersMap["-"+t[e].id+"-"]?(i.usersMap["-"+t[e].id+"-"].picture+=t[e].picture?"data:image/png;base64,"+t[e].picture:"",i.usersMap["-"+t[e].id+"-"].name=t[e].name||"",i.usersMap["-"+t[e].id+"-"].username=t[e].username||"",i.usersMap["-"+t[e].id+"-"].email=t[e].email||""):console.log("The object is undefined");i.getUsersAssignees(),a.resolve()}),a.promise()},getUsersAssignees:function(){for(var t=0;t<this.usersInformation.length;t++)this.usersAssignees.push(this.getUserAssignee(this.usersInformation[t]))},getUserAssignee:function(t){var e=this,i=[];$.each(e.params.plan.activities,function(a,r){r.userAssigned===t.id&&e.activityRuning(r)&&i.push({name:r.name})}),t.tasks=i;var a=e.activitiesUsers.find(function(e){return e.idUser==t.id});return t.userType=a.userType,usersAdapter.createJsonUserInfo(t.id,t.name,t.username,t.picture?"data:image/png;base64,"+t.picture:void 0,t.email,t.name.getInitials(),e.getIsAssignee(t),e.getIsOwner(t),t.tasks,[])},addEventHandlersModal:function(){var t=this;$(".moreUsers").click(function(e){e.preventDefault(),e.stopPropagation();var i=t.usersAssignees||[];t.globalHandlersService.publish("showDialogWidget",{widgetName:bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_USERS_MODAL,closeVisible:!0,data:i,maximize:!0,modalParameters:{title:bizagi.localization.getResource("workportal-project-users-title")+" ("+i.length+")",width:790,height:526,refreshInbox:!1}})})}}),bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.users",["workportalFacade","dataService",bizagi.workportal.widgets.project.plan.activity.users],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.dashboard.menu.activity.plan",{},{init:function(t,e,i){this.params=i||{},this._super(t,e,i),this.loadTemplates({"project-dashboard-menu":bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.dashboard.menu.activity.plan").concat("#project-dashboard-menu2")})},renderContent:function(){return this.content=$("<div></div>"),this.content},postRender:function(){var t=this;t.params.contextsLeftSidebarCaseDashboard.forEach(function(e){t.sub(e,$.proxy(t.updateView,t))})},updateView:function(t,e){var i=this;i.params=$.extend(i.params,e.args),i.clean();var a=i.getContent().empty(),r={showFormOverview:i.params.menuDashboard.showFormOverview,showFormActivity:i.params.menuDashboard.showFormActivity,showCommentsOptionMenu:i.params.menuDashboard.showCommentsOptionMenu,showFilesOptionMenu:i.params.menuDashboard.showFilesOptionMenu,showTimeLineOptionMenu:i.params.menuDashboard.showTimeLineOptionMenu,showPlanOptionMenu:i.params.menuDashboard.showPlanOptionMenu,contextPlanOptionMenu:i.params.menuDashboard.contextPlanOptionMenu,contextFormActivityOptionMenu:i.params.menuDashboard.contextFormActivityOptionMenu,contextualized:i.params.plan.contextualized};i.getTemplate("project-dashboard-menu").render(r).appendTo(a),i.params.showContextByMenuDashboard&&$("li[data-context='"+t.type.toUpperCase()+"']",i.content).addClass("active").siblings().removeClass("active"),i.handlerEvents();var o={idPlan:i.params.plan.id};$.when(i.callGetPlan(o)).then(function(t){$.extend(i.params.plan,t),i.pub("notify",{type:"LOAD_INFO_PLAN",args:i.params})})},loadContentById:function(t){var e=this;t.preventDefault();var i=$(t.target).closest("li");i.hasClass("active")||$.when(bizagi.util.autoSave()).done(function(){$(document).data("auto-save","");var t=i.data("context");if(t){var a=e.pub("notify",{type:"NAVIGATOR_GETLEVEL"}),r=parseInt(a[0]);e.params.refreshLastItemBreadcrumb=!1,e.pub("notify",{type:t.toUpperCase(),args:$.extend(e.params,{showContextByMenuDashboard:t,histName:"",level:r})}),$("li[data-context='"+e.params.showContextByMenuDashboard.toUpperCase()+"']",e.content).addClass("active").siblings().removeClass("active")}})},callGetPlan:function(t){var e=$.Deferred();return this.dataService.getPlan(t).always(function(t){200===t.status||201===t.status||void 0===t.status?e.resolve(t):e.reject()}),e.promise()},subMenuHandler:function(){var t=this.getContent(),e=$("[data-context='ACTIVITYPLANCOMMENTS']",t),i=$("[data-context='ACTIVITYPLANFILES']",t),a=$("[data-context='ACTIVITYPLANTIMELINE']",t);$(".ui-bizagi-wp-project-tab-submenu a",t).on("click",function(){e.toggle(),i.toggle(),a.toggle()})},handlerEvents:function(){var t=this.getContent();this.subMenuHandler(),$(".ui-bizagi-wp-project-tab-links a",t).on("click",$.proxy(this.loadContentById,this))},clean:function(){var t=this,e=t.getContent();t.params&&t.params.contextsLeftSidebarCaseDashboard&&t.params.contextsLeftSidebarCaseDashboard.forEach(function(e){t.unsub(e,$.proxy(t.updateView,t))}),$(".ui-bizagi-wp-project-tab-links a",e).off()}}),bizagi.injector.register("bizagi.workportal.widgets.project.dashboard.menu.activity.plan",["workportalFacade","dataService",bizagi.workportal.widgets.project.dashboard.menu.activity.plan],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.content.dashboard",{},{init:function(t,e,i){this._super(t,e,i),this.loadTemplates({"project-content-dashboard":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.content.dashboard").concat("#project-plan-content-dashboard")})},renderContent:function(){var t=this.getTemplate("project-content-dashboard");return this.content=t.render({}),this.content},postRender:function(){setTimeout(function(){$(window).trigger("resize")},1e3)}}),bizagi.injector.register("bizagi.workportal.widgets.project.content.dashboard",["workportalFacade","dataService",bizagi.workportal.widgets.project.content.dashboard],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.processMap",{},{init:function(t,e,i){this._super(t,e,i),this.instanceBizagiProcessMap=new bizagi.processMap(this),this.loadTemplates({"project-processmap":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processMap").concat("#project-processmap-wrapper"),"project-process-diagram":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processMap").concat("#project-processmap-process-diagram"),"project-activity-map":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processMap").concat("#project-processmap-activity-map"),"project-subprocess":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processMap").concat("#project-processmap-subprocess")})},renderContent:function(){var t=this.instanceBizagiProcessMap.renderContent();return this.content=t.render(this.viewOptions),this.content},postRender:function(){this.instanceBizagiProcessMap.postRender()},configureHandlers:function(){this.instanceBizagiProcessMap.configureHandlers()},onProcessDiagram:function(){this.instanceBizagiProcessMap.onProcessDiagram()},onActivityMap:function(){this.instanceBizagiProcessMap.onActivityMap()},onSupprocess:function(){this.instanceBizagiProcessMap.onSupprocess()},navigationManager:function(t){var e=this.instanceBizagiProcessMap.navigationManager(t);e.container.append(e.template.render(e.viewOptions))},renderProcessDiagram:function(){this.instanceBizagiProcessMap.renderProcessDiagram()},resize:function(){this.instanceBizagiProcessMap.resize()},renderActivityMap:function(){this.instanceBizagiProcessMap.renderActivityMap()},renderSubProcessMap:function(){this.instanceBizagiProcessMap.renderSubProcessMap()},appendActivityMapZoom:function(){this.instanceBizagiProcessMap.appendActivityMapZoom()},appendProcessMapZoom:function(){this.instanceBizagiProcessMap.appendProcessMapZoom()},appendSubprocessZoom:function(){this.instanceBizagiProcessMap.appendSubprocessZoom()},appendSubprocessDragScroll:function(){this.instanceBizagiProcessMap.appendSubprocessDragScroll()},bindTooltip:function(t){this.instanceBizagiProcessMap.bindTooltip(t)}}),bizagi.injector.register("bizagi.workportal.widgets.project.processMap",["workportalFacade","dataService",bizagi.workportal.widgets.project.processMap]),bizagi.workportal.widgets.graphicquery.extend("bizagi.workportal.widgets.project.processDiagram.helper",{},{getPVHeight:function(){var t=$(window).height()-50,e=this.$header.height()+180;return($(".ui-bizagi-wp-project-tab-content").height()||t)-e}}),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.activity.sidebar",{},{init:function(t,e,i){this._super(t,e,i),(i=i||{}).supportNav=!1,this.loadTemplates({"project-activity-sidebar":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.activity.sidebar").concat("#project-activity-sidebar")})},renderContent:function(){var t=this.getTemplate("project-activity-sidebar");return this.content=t.render({}),this.content}}),bizagi.injector.register("bizagi.workportal.widgets.project.activity.sidebar",["workportalFacade","dataService",bizagi.workportal.widgets.project.activity.sidebar]),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.activityMap",{},{init:function(t,e,i){this.radNumber=i.radNumber,this._super(t,e,i),this.loadTemplates({"project-activityMap":bizagi.getTemplate("bizagi.workportal.desktop.widget.project.activityMap").concat("#project-activityMap-wrapper")})},renderContent:function(){var t=this.getTemplate("project-activityMap");return this.content=t.render({}),this.content},postRender:function(){var t=this;t.sub("HOME",$.proxy(t.updateView,t)),t.sub("OVERVIEW",$.proxy(t.updateView,t)),t.sub("COMMENTS",$.proxy(t.updateView,t)),t.sub("PROCESSMAP",$.proxy(t.updateView,t)),t.sub("LOG",$.proxy(t.updateView,t)),t.sub("PLANCREATE",$.proxy(t.updateView,t)),t.sub("PLANCOMMENTS",$.proxy(t.updateView,t))},updateView:function(t,e){var i=e.args,a=this.getContent().empty(),r={actualState:""};i.currentState[0]&&(r.actualState=i.currentState[0].state),this.getTemplate("project-activityMap").render($.extend(i,r)).appendTo(a),this.params=i}}),bizagi.injector.register("bizagi.workportal.widgets.project.activityMap",["workportalFacade","dataService",bizagi.workportal.widgets.project.activityMap],!0),bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.activityMap.tooltip",{},{init:function(t,e,i){this._super(t,e,i),this.loadTemplates({"project-tooltip":bizagi.getTemplate("bizagi.workportal.desktop.widget.activityMap.tooltip").concat("#project-processmap-tooltip")}),this.cache={},this.radNumber=i.radNumber},renderContent:function(){},postRender:function(){this.dateFormat=this.getResource("dateFormat")+" "+this.getResource("timeFormat")},configureHandlers:function(t,e){t.find(".ui-bizagi-wp-project-processmap-process").on("click",$.proxy(this.onProcess,this,e)),t.find(".ui-bizagi-wp-project-processmap-tooltip-title").on("click",$.proxy(this.onIdCase,this,e))},onProcess:function(t,e){this.showGraphicQuery(t)},onIdCase:function(t,e){var i=$(e.currentTarget).data("idcase"),a=$(e.currentTarget).data("idworkitem"),r=$(e.currentTarget).data("idtask"),o=$(e.currentTarget).data("idworkflow");this.publish("executeAction",{action:bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,idCase:i,idWorkItem:a,idTask:r,idWorkflow:o})},bindTooltip:function(t){var e=this;e.tooltipClass=t.tooltipClass,t.$container.tooltip({items:t.items,content:function(i){if(!(t.$container.data("clicked")||!1)){if("activityMap"==t.diagram){if(!$(this).is("circle"))return;if(this.className.baseVal.indexOf("activity-map-activity-highlight")<0)return;$.when(e.getActivityMapTooltipContent($(this))).done(function(t){i(t)})}else{var a=e.getSubprocessTooltipContent($(this));i(a)}return"loading.."}},open:function(t,e){for(var i=0;i<$(".ui-tooltip").length-1;i++)$("#"+$(".ui-tooltip")[i].id).remove()},show:{duration:60,effect:"none"},tooltipClass:e.tooltipClass,hide:{delay:60,duration:60},position:{my:"left+20 top+20"},close:function(t,e){e.tooltip.hover(function(){$(this).stop(!0).fadeTo(120,1)},function(){$(this).fadeOut(20,function(){$(this).remove()})})}})},getActivityMapTooltipContent:function(t){var e=this,i=new $.Deferred,a=t.data("guidWorkitem"),r={guidWorkitem:a,gqData:{idCase:t.data("idCase"),idWorkflow:t.data("idWorkflow")}};if(e.guidWorkitem=a,e.isCached(r.guidWorkitem)){var o=e.cache[r.guidWorkitem];i.resolve(e.buildContent(o,r.gqData))}else $.when(e.dataService.getActivitySummary(r)).done(function(t){i.resolve(e.buildContent(t,r.gqData)),e.appendToCache(r.guidWorkitem,t)});return i.promise()},getSubprocessTooltipContent:function(t){var e={gqData:{idCase:t.data("idcase"),idWorkflow:t.data("idworkflow")}},i={endDate:t.data("enddate"),startDate:t.data("startdate"),process:t.data("process"),idCase:t.data("idcase")};return this.buildContent(i,e.gqData)},appendToCache:function(t,e){this.cache[t]=e},isCached:function(t){return void 0!==this.cache[t]},buildContent:function(t,e){var i=this,a=$("<div></div>"),r=i.getTemplate("project-tooltip"),o=void 0!==t.assigneeName;return t.assignee=o,t.radNumber=i.radNumber,t.idWorkflow=e.idWorkflow,t.idTask=t.idTask||0,t.idWorkitem=t.idWorkItem||0,t.graphicQuery=bizagi.menuSecurity.GraphicQuery,a=r.render(t),$("."+i.tooltipClass).html(a),bizagi.util.formatInvariantDate(a,i.dateFormat),i.configureHandlers(a,e),a}});
//# sourceMappingURL=../../../../Maps/desktop/activityplanprocessmap.desktop.production.js.map
