'use strict'

class Entries {
    constructor() {
        this.nameInput = document.getElementById("name");
        this.surnameInput = document.getElementById("surname");
        this.ageInput = document.getElementById("age");
        this.phoneInput = document.getElementById("phone");
        this.saveButton = document.getElementById("saveButton");
        this.listButton = document.getElementById("listButton");
        this.delistButton = document.getElementById("delistButton");

        const entryList = localStorage.getItem("entryList");
        this.entryList = entryList ? JSON.parse(entryList) : [];

        this.createEntry();
        this.showEntries();
        this.hideEntries();
    }

    createEntry() { //Vytvoření záznamu a uložení do JSON. Přidání záznamu do pole všech záznamů a přidání tlačítka pro smazání záznamu k nově vytvpřenému záznamu.
        this.saveButton.onclick = () => {

            if (this.validateInputs()) {
                const entry = new Insured(this.nameInput.value, this.surnameInput.value, this.ageInput.value, this.phoneInput.value);
                this.entryList.push(entry);
                localStorage.setItem("entryList", JSON.stringify(this.entryList));

                this.nameInput.value = ""; //Vkládám prázdné hodnoty, aby se znovu vypsal placeholder do inputboxů.
                this.surnameInput.value = "";
                this.ageInput.value = "";
                this.phoneInput.value = "";

                this.checkTableExistence(); //Ověření a případné odstranění již existujícho výpisu.
                this.listEntries(); //Zobrazení aktuálního výpisu.
            } else alert("Oprav vstupní hodnoty!");
        }
    }

    listEntries() { // Vypsání záznamů do tabulky.
        const tableOfInsured = document.createElement("table"); //Vytvoření tabulky, do které se budou vypisovat záznamy.
        const tableHead = ["Jméno:", "Příjmení:", "Věk:", "Telefon:", ""]; //Pole s popisky, které budou v hlavičce tabulky.
        for (const header of tableHead) { //Uložení jednotlivých popisků hlavičky do proměnné header.
            const tableHeadCell = document.createElement("th"); //Vytvoření hlavičky pro každý nadpis z tableHead.
            tableHeadCell.textContent = header; //Načtení obsahu header do každé z buňek hlavičky.
            tableOfInsured.appendChild(tableHeadCell); //Přidání hlavičky k tabulce tableOfInsured.
        }
        for (const entry of this.entryList) { //Vytvoření řádku pro každý záznam z entryList.
            const row = document.createElement("tr"); //Vyvtoření řádků a jejich načtení do proměnné row.
            for (const data in entry) { //Naplnění buněk hodnotami z entryList.
                const cell = document.createElement("td"); //Vyvtoření buněk tabulky a jejich načtení do proměnné cell.
                cell.textContent = entry[data]; //Načtení všech hodnot jejich přiřazení do buňek jako .teextContent.
                row.appendChild(cell); //Přidání buňek do tabulky.
            }

            const deleteButtonCell = document.createElement("td"); //Vyvtoření buňky pro mzací tlačítko.
            const deleteButton = document.createElement("button"); //Vyvtoření mazacího tlačítka.
            deleteButton.innerText = "Smazat záznam"; //Popisek mazacího tlačítka.
            deleteButton.onclick = () => this.deleteEntry(entry); //Funkce pro vymazání záznamu na řádku.
            deleteButtonCell.appendChild(deleteButton); //Přidání mazacího tlačítka do buňky.
            deleteButton.id = "deleteButton"; //ID mazacího tlačítka pro CSS.
            row.appendChild(deleteButtonCell); //Přidání buňky s tlačítkem do dokumentu.
            tableOfInsured.appendChild(row); //Přidání řádku tabulky.
        }
        document.body.appendChild(tableOfInsured); //Vypsání hotové tabulky se všemi záznamy do dokumentu (rád bych vypsal do article, nevím jak).

    }

    deleteEntry(entry) { // Vymazání záznamu na řádku.
        const index = this.entryList.indexOf(entry);
        if (index !== -1) {
            this.entryList.splice(index, 1);
            localStorage.setItem("entryList", JSON.stringify(this.entryList));
            this.checkTableExistence()
            this.listEntries();
        }
    }

    _deleteAllEntries() { //Pouze pomůcka.
        localStorage.removeItem("entryList");
        this.entryList = [];
        this.listEntries();
    }

    showEntries() { //Tlačítko pro zobrazení seznamu pojištěnců s kontrolou, jestli již seznam není vypsaný.
        this.listButton.onclick = () => {
            this.checkTableExistence();
            this.listEntries()
        }
    }

    hideEntries() {//Skrytí tabulky se záznamy.
        this.delistButton.onclick = () => {
            this.checkTableExistence();
        }
    }

    checkTableExistence() {//Ověření, jestli jsou již záznamy vypsání a jejich případné odstranění.
        const existingTable = document.querySelector("table");
        if (existingTable) {
            existingTable.remove();
        }
    }

    checkTableData() { //Ověření, jestli je již něco uloženo, aby se nezobrazovala pouze hlavička.

    }

    formatName() {
        let formattedName = this.nameInput.value.trim();
        if (formattedName.length > 0) {
            formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1).toLowerCase();
            this.nameInput.value = formattedName;
            return true;
        } else alert("Musíš zadat jméno!");
            return false;
    }

    formatSurname() {
        let formattedName = this.surnameInput.value.trim();
        if (formattedName.length > 0) {
            formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1).toLowerCase();
            this.surnameInput.value = formattedName;
            return true;
        } else alert("Musíš zadat příjmení!");
            return false;
    }

    formatAge() {
        let formattedAge = this.ageInput.value.trim();
        if (formattedAge.length > 0) {
            this.ageInput.value = formattedAge;
            return true;
        } 
        else alert("Musíš zadat věk!");
            return false;
    }

    formatPhoneNo() {
        let formattedPhoneNo = this.phoneInput.value.trim();
        let numberToCheck = formattedPhoneNo.split(" ").join("");
        if (numberToCheck.length !== 9) {
            alert("Telefonní číslo musí mít 9 znaků!")
            return false;
        } else {
            formattedPhoneNo =
                formattedPhoneNo.substr(0, 3) + ' ' +
                formattedPhoneNo.substr(3, 3) + ' ' +
                formattedPhoneNo.substr(6, 3);
            this.phoneInput.value = formattedPhoneNo;
            return true;
        }
    }

    validateName() {
        const textRegex = /^[\p{L}\s]+$/u;

        if (textRegex.test(this.nameInput.value)) {
            return true;
        } else alert("Jméno nesmí obsahovat čísla, ani speciální znaky!");
            return false;
    }

    validateSurame() {
        const textRegex = /^[\p{L}\s]+$/u;

        if (textRegex.test(this.surnameInput.value)) {
            return true;
        } else alert("Příjmení nesmí obsahovat čísla, ani speciální znaky!");
            return false;
    }

    validateAge() {
        const numericRegex = /^\d+$/;

        if (numericRegex.test(this.ageInput.value)) {
            return true;
        } else alert("Věk může obsahovat pouze čísla!");
            return false;
    }

    validateInputs() {
        return this.formatName() &&
               this.validateName() &&
               this.formatSurname() &&
               this.validateSurame() &&
               this.formatAge() &&
               this.validateAge() &&
               this.formatPhoneNo();
    }

}
