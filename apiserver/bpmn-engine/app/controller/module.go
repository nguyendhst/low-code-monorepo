package controller

import "go.uber.org/fx"

var Module = fx.Module(
	"controller",
	fx.Provide(
		NewLaunchWorkflowController,
		NewFetchWorkflowStatusController,
		NewStoreExecutionLogController,
		NewFetchGoogleSheetConfigController,
	),
)
