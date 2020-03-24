module.exports = () => (
    {
        sportType: {
            sportTypeId: 1,
            sportTypeKey: 'running',
        },
        workoutName: null,
        workoutSegments: [
            {
                segmentOrder: 1,
                sportType: {
                    sportTypeId: 1,
                    sportTypeKey: 'running',
                },
                workoutSteps: [
                    {
                        type: 'ExecutableStepDTO',
                        stepId: null,
                        stepOrder: 1,
                        childStepId: null,
                        description: null,
                        stepType: {
                            stepTypeId: 3,
                            stepTypeKey: 'interval',
                        },
                        endCondition: {
                            conditionTypeKey: 'distance',
                            conditionTypeId: 3,
                        },
                        preferredEndConditionUnit: {
                            unitKey: 'kilometer',
                        },
                        endConditionValue: null,
                        endConditionCompare: null,
                        endConditionZone: null,
                        targetType: {
                            workoutTargetTypeId: 1,
                            workoutTargetTypeKey: 'no.target',
                        },
                        targetValueOne: null,
                        targetValueTwo: null,
                        zoneNumber: null,
                    },
                ],
            },
        ],
    }
);
