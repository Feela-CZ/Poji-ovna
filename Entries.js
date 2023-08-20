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

        this.currentYear();
        this.createEntry();
        this.showEntries();
        this.hideEntries();
    }

    createEntry() { //Vytvoření záznamu a uložení do JSON.
        this.saveButton.onclick = () => {

            if (this.validateInputs()) {
                const entry = new Insured(this.nameInput.value, this.surnameInput.value, this.ageInput.value, this.phoneInput.value, this.insuranceType);
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

    listEntries() { // Vypsání záznamů do tabulky + vytvoření tlačítek pro detail a mazání.
        if (this.checkTableData()) {
            const tableOfInsured = document.createElement("table"); //Vytvoření tabulky, do které se budou vypisovat záznamy.
            const tableHead = ["Jméno:", "Příjmení:", "Věk:", "Telefon:", "Pojistka:", "", ""]; //Pole s popisky, které budou v hlavičce tabulky.
            for (const header of tableHead) { //Uložení jednotlivých popisků hlavičky do proměnné header.
                const tableHeadCell = document.createElement("th"); //Vytvoření hlavičky pro každý nadpis z tableHead.
                tableHeadCell.textContent = header; //Načtení obsahu header do každé z buňek hlavičky.
                tableOfInsured.appendChild(tableHeadCell); //Přidání hlavičky k tabulce tableOfInsured.
            }
            for (const entry of this.entryList) { //Vytvoření řádku pro každý záznam z entryList.
                const row = document.createElement("tr"); //Vyvtoření řádků a jejich načtení do proměnné row.
                for (const data in entry) { //Naplnění buněk hodnotami z entryList.
                    const cell = document.createElement("td"); //Vyvtoření buněk tabulky a jejich načtení do proměnné cell.
                    cell.textContent = entry[data]; //Načtení všech hodnot jejich přiřazení do buňek.
                    row.appendChild(cell); //Přidání buňek do tabulky.
                }

                const detailButtonCell = document.createElement("td");
                const detailButton = document.createElement("button");
                detailButton.innerText = "Detail";
                detailButton.onclick = () => this.showDetail(entry);
                detailButtonCell.appendChild(detailButton);
                detailButton.id = "detailButton";
                row.appendChild(detailButtonCell);
                tableOfInsured.appendChild(row);

                const deleteButtonCell = document.createElement("td");
                const deleteButton = document.createElement("button");
                deleteButton.innerText = "Smazat záznam";
                deleteButton.onclick = () => this.deleteEntry(entry);
                deleteButtonCell.appendChild(deleteButton);
                deleteButton.id = "deleteButton";
                row.appendChild(deleteButtonCell);
                tableOfInsured.appendChild(row);

            }
            this.checkListExistence();
            document.body.appendChild(tableOfInsured); //Vypsání hotové tabulky se všemi záznamy do dokumentu.
        }
        else alert("V seznamu aktuálně nejsou vedeni žádní pojištěnci.");

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

    hideEntries() { //Skrytí tabulky se záznamy.
        this.delistButton.onclick = () => {
            this.checkTableExistence();
        }
    }

    checkTableExistence() { //Ověření, jestli jsou již záznamy vypsány a jejich případné odstranění.
        const existingTable = document.querySelector("table");
        if (existingTable) {
            existingTable.remove();
        }
    }

    checkTableData() { //Ověření, jestli je již něco uloženo, aby se nezobrazovala pouze hlavička.
        if (this.entryList == "") {
            return false;
        } else return true;
    }

    formatName() { //Kontrola, že existuje vstup v inputu jméno a jeho naformátování.
        let formattedName = this.nameInput.value.trim();
        if (formattedName.length > 0) {
            formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1).toLowerCase();
            this.nameInput.value = formattedName;
            return true;
        } else alert("Musíš zadat jméno!");
        return false;
    }

    formatSurname() { //Kontrola, že existuje vstup v inputu příjmení a jeho naformátování.
        let formattedName = this.surnameInput.value.trim();
        if (formattedName.length > 0) {
            formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1).toLowerCase();
            this.surnameInput.value = formattedName;
            return true;
        } else alert("Musíš zadat příjmení!");
        return false;
    }

    formatAge() { //Kontrola, že existuje vstup v inputu věk, že není 0 a jeho naformátování.
        let formattedAge = this.ageInput.value.trim();
        if ((formattedAge.length > 0) && (formattedAge !== "0")) {
            this.ageInput.value = formattedAge;
            return true;
        }
        else alert("Musíš zadat věk!");
        return false;
    }

    formatPhoneNo() { //Kontrola, že vstup v inputu telefon má 9 znaků a přidání mezer za každé tři číslice.
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

    validateName() { //Ověření, že jméno se skládá z písmen.
        const textRegex = /^[\p{L}\s]+$/u;

        if (textRegex.test(this.nameInput.value)) {
            return true;
        } else alert("Jméno nesmí obsahovat čísla, ani speciální znaky!");
        return false;
    }

    validateSurame() { //Ověření, že příjmení se skládá z písmen.
        const textRegex = /^[\p{L}\s]+$/u;

        if (textRegex.test(this.surnameInput.value)) {
            return true;
        } else alert("Příjmení nesmí obsahovat čísla, ani speciální znaky!");
        return false;
    }

    validateAge() { //Ověření, že věk se skládá z číslic.
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

    currentYear() {
        const currentYear = new Date().getFullYear();
        document.getElementById("currentYear").textContent = currentYear;
    }

    showDetail(entry) { //Nezvládl jsem dopracovat :(
        const keyMappings = {
            name: "Jméno:",
            surname: "Příjmení:",
            age: "Věk:",
            phone: "Telefon:",
            insuranceType: "Typ pojištění:"
        }

        const index = this.entryList.indexOf(entry);
        if (index !== -1) {
            const retrievedEntryList = JSON.parse(localStorage.getItem("entryList"));
            const selectedEntry = retrievedEntryList[index];

            this.checkTableExistence();
            this.checkListExistence();

            const detailsCard = document.createElement("div");
            detailsCard.id = "detailsCard";

            const avatar = document.createElement("img");
            avatar.src = "avatar.png";
            avatar.id = "avatar";
            detailsCard.appendChild(avatar);

            const detailsList = document.createElement("ul");
/*
            const button = document.createElement("button");
                button.id = "insuranceTypeButton";
                button.textContent = "Zadat typ pojistky";
                detailsCard.appendChild(button);
                console.log("selectedEntry:", selectedEntry);
            
            button.onclick = () => this.updateInsuranceType(selectedEntry);
*/
            this.checkTableExistence();
            this.checkListExistence();

            for (const key in selectedEntry) {

                const listItem = document.createElement("li");
                if (key === "insuranceType" && selectedEntry[key] === "") {
                    listItem.textContent = `${keyMappings[key]} Nezadáno`;
                } else {
                    listItem.textContent = `${keyMappings[key]} ${selectedEntry[key]}`;
                }
                detailsList.appendChild(listItem);
            }
            detailsCard.appendChild(detailsList);

            const cross = document.createElement("img");
            cross.src = "cross.png";
            cross.id = "cross";
            detailsCard.appendChild(cross);
            document.body.appendChild(detailsCard);
            cross.onclick = () => {
                this.checkListExistence();
            }
        }

        
    }

    checkListExistence() {
        const existingDetailsList = document.getElementById("detailsCard");
        if (existingDetailsList) {
            existingDetailsList.remove();
        }
    }
/*
    updateInsuranceType(entry) {
        const insuranceType = prompt("Zadejte typ pojistné smlouvy:");
    
        if (insuranceType !== null && insuranceType.trim() !== "") {
            const index = this.entryList.indexOf(entry);
            if (index !== -1) {
                this.entryList[index].insuranceType = insuranceType;
                localStorage.setItem("entryList", JSON.stringify(this.entryList));
    
                console.log(this.entryList);
            }
        }
    }
*/
}
