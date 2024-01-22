export class Card {
    constructor(
        public charType = "",
        public firstName ="",
        public lastName = "",
        public race = "",
        public charClass = "",
        public charSubClass = "",
        public problem = "",
        public goal = ""
    ) {}

    public name() {
        return this.firstName + " " + this.lastName;
    }

    public shortDescriptor() {
        if (this.charSubClass === "") {
            return this.race + " " + this.charClass;
        }
        return this.race + " " + this.charSubClass + " " + this.charClass;
    }

    public header() {
        return this.charType;
    }

    public setHeader(props: string) {
        this.charType = props;
    }
}