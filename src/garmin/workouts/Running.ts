import template, { IRunningWorkout } from './templates/RunningTemplate';

export default class Running {
    private data: IRunningWorkout;
    constructor() {
        this.data = template();
    }

    get name() {
        return this.data.workoutName;
    }

    set name(name) {
        this.data.workoutName = `${name}`;
    }

    get distance() {
        return (
            this.data.workoutSegments[0].workoutSteps[0].endConditionValue || 0
        );
    }

    set distance(meters: number) {
        this.data.workoutSegments[0].workoutSteps[0].endConditionValue =
            Math.round(meters);
    }

    get workoutId() {
        return this.data.workoutId;
    }

    set workoutId(workoutId) {
        this.data.workoutId = workoutId;
    }

    get description() {
        return this.data.description;
    }

    set description(description) {
        this.data.description = description;
    }

    isValid() {
        return !!(this.name && this.distance);
    }

    toJson() {
        return this.data;
    }

    toString() {
        return `${this.name}, ${(this.distance / 1000).toFixed(2)}km`;
    }
}
