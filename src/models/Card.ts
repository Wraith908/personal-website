export class Card {
    constructor(
        public charType = "",
        public firstName ="",
        public lastName = "",
        public gender = "",
        public race = "",
        public charClass = "",
        public charSubClass = "",
        public problem = "",
        public goal = "",
        public patron = "", 
        public misc = "",
        public pageRef = ""
    ) {}

    public name() {
        return this.firstName + " " + this.lastName;
    }

    public shortDescriptor() {
        if (this.charSubClass === "") {
            return this.gender + " " + this.race + " " + this.charClass;
        }
        return this.gender + " " + this.race + " " + this.charSubClass + " " + this.charClass;
    }

    public motivation() {
        return "seeks to " + this.goal + " for " + this.patron + " and must " + this.problem;
    }

    public references () {
        return this.pageRef;
    }

    public header() {
        return this.charType;
    }

    public setHeader(props: string) {
        this.charType = props;
    }
}