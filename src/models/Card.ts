export class Card {
    constructor(
        public id = 0,
        public charType = "",
        public firstName ="",
        public lastName = "",
        public genderPres = "",
        public race = "",
        public charClass = "",
        public background = "",
        public challenge = "",
        public goal = "",
        public patron = "", 
        public misc = "",
        public pageRef = ""
    ) {}

    public name() {
        return this.firstName + " " + this.lastName;
    }

    public shortDescriptor() {
        return this.genderPres + " " + this.race + " and " + this.charClass + ".";
    }

    public charHistory() {
        return "They were " + this.background + ", ";
    }

    public motivation() {
        return "are " + this.goal + " and " + this.challenge + ".";
    }

    public miscellaneous() {
        return this.misc;
    }
    public references () {
        return this.pageRef;
    }

    public header() {
        return this.charType;
    }
    //Set Functions
    public setID(props: number ) {
        this.id = props;
    }
    public setHeader(props: string) {
        this.charType = props;
    }

    public setFirstName(props: string) {
        this.firstName = props;
    }

    public setLastName(props:string) {
        this.lastName = props;
    }

    public setGenderPres(props: string) {
        this.genderPres = props;
    }

    public setRace(props: string) {
        this.race = props;
    }

    public setClass(props: string) {
        this.charClass = props;
    }

    public setBackground(props: string) {
        this.background = props;
    }

    public setChallenge(props: string) {
        this.challenge = props;
    }

    public setGoal(props: string) {
        this.goal = props;
    }

    public setPatron(props: string) {
        this.patron = props;
    }

    public setMisc(props: string) {
        this.misc = props;
    }

    public addReference(props: string) {
        this.pageRef += props + " ";
    }
}