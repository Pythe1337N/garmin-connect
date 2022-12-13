export interface ISportType {
    sportTypeId: number;
    sportTypeKey: SportTypeKey;
}

enum SportTypeKey {
    running = 'running'
}

export interface IRunningWorkout {
    workoutId: string | undefined;
    description: string | undefined;
    sportType: ISportType;
    workoutName: string;
    workoutSegments: IWorkoutSegment[];
}

export interface IWorkoutSegment {
    segmentOrder: number;
    sportType: ISportType;
    workoutSteps: IWorkoutStep[];
}

export interface IWorkoutStep {
    type: WorkoutStepType;
    stepId: unknown;
    stepOrder: number;
    childStepId: unknown;
    description: string | null;
    stepType: IStepType;
    endCondition: IEndCondition;
    preferredEndConditionUnit: IPreferredEndConditionUnit;
    endConditionValue: number | null;
    endConditionCompare: null;
    endConditionZone: null;
    targetType: ITargetType;
    targetValueOne: null;
    targetValueTwo: null;
    zoneNumber: null;
}

enum WorkoutStepType {
    executableStepDTO = 'ExecutableStepDTO'
}

export interface IStepType {
    stepTypeId: number;
    stepTypeKey: StepTypeKey;
}

enum StepTypeKey {
    interval = 'interval'
}

export interface IEndCondition {
    conditionTypeKey: ConditionTypeKey;
    conditionTypeId: number;
}

enum ConditionTypeKey {
    distance = 'distance'
}

export interface IPreferredEndConditionUnit {
    unitKey: UnitKey;
}

enum UnitKey {
    kilometer = 'kilometer'
}

export interface ITargetType {
    workoutTargetTypeId: number;
    workoutTargetTypeKey: WorkoutTargetTypeKey;
}

enum WorkoutTargetTypeKey {
    noTarget = 'no.target'
}

export default function (): IRunningWorkout {
    return {
        description: undefined,
        workoutId: undefined,
        sportType: {
            sportTypeId: 1,
            sportTypeKey: SportTypeKey.running
        },
        workoutName: '',
        workoutSegments: [
            {
                segmentOrder: 1,
                sportType: {
                    sportTypeId: 1,
                    sportTypeKey: SportTypeKey.running
                },
                workoutSteps: [
                    {
                        type: WorkoutStepType.executableStepDTO,
                        stepId: null,
                        stepOrder: 1,
                        childStepId: null,
                        description: null,
                        stepType: {
                            stepTypeId: 3,
                            stepTypeKey: StepTypeKey.interval
                        },
                        endCondition: {
                            conditionTypeKey: ConditionTypeKey.distance,
                            conditionTypeId: 3
                        },
                        preferredEndConditionUnit: {
                            unitKey: UnitKey.kilometer
                        },
                        endConditionValue: null,
                        endConditionCompare: null,
                        endConditionZone: null,
                        targetType: {
                            workoutTargetTypeId: 1,
                            workoutTargetTypeKey: WorkoutTargetTypeKey.noTarget
                        },
                        targetValueOne: null,
                        targetValueTwo: null,
                        zoneNumber: null
                    }
                ]
            }
        ]
    };
}
