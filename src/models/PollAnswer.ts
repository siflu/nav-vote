export class PollAnswer {
    title: string;
    optionsWithCount: Map<string, number>;

    constructor() {
        this.title = "";
        this.optionsWithCount = new Map<string, number>();
    }

}