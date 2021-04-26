const agendaNumbers = [
    {
        name: "Alin Gheorghe",
        number: "0745555555"
    },
    {
        name: "Alina Popa",
        number: "0745555555"
    },
    {
        name: "George Popescu",
        number: "0745555555"
    },
    {
        name: "John Doe",
        number: "0745555555"
    },
    {
        name: "Richard Jake",
        number: "0745555555"
    },
];

let clickedContact = '';
let clickedContactNumber = '';

function format(text) {
    return text.replace(/\s+/g, '').toLowerCase()
}

function contactHTML(contact){
    return `
    <li class="contact contact-main">
        <p class="contact-name" >${contact.name}</p>
        <ul class="edit-contact" data-role="listmenu">
            <form  action="">
                <div class="${format(contact.name)}message edit-message"></div>
                <div class="name">
                    <label for="name-value">Contact name:</label>
                    <input class="edit-name ${format(contact.name)}"  type="text" value="${contact.name}">
                </div>
                <div class="phone-number">
                    <label for="phone-number">Phone-number:</label>
                    <input class="edit-number ${format(contact.name)}number" type="text" value="${contact.number}" >
                </div>
                <div>
                    <button class="edit-btn" type="button">Save Changes</button>
                    <button class="delete-btn" type="button">Delete contact</button>
                </div>
            </form>
        </ul>
    </li>
    ` ;
};

function sortAgenda(inputName,inputNumber) {
    agendaNumbers.push({name: inputName, number: inputNumber});
    function compare( a, b ) {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name> b.name ){
          return 1;
        }
        return 0;
    }
      
    agendaNumbers.sort( compare );
};

function destroyListMenu() {
    $('#list').jqxListMenu('destroy');
    $(".container").append("<ul id='list' data-role='listmenu'></ul>");
};

function createListMenu() {
    agendaNumbers.map(contact => {
        $('#list').append(contactHTML(contact));
    });
    $('#list').jqxListMenu({autoSeparators: true, enableScrolling: false, showHeader: true ,width: '600px', placeHolder: 'Find contact...'});
};

function inputFormat() {
    $('input').keyup(function() {
        const raw_text =  $(this).val();
        const return_text = raw_text.replace(/[^a-zA-Z0-9 _]/g,'');
        $(this).val(return_text);
    });
};

function inputPhoneNumber() {
    $(".phone-number input").jqxMaskedInput({mask: '##########'});
};

function inputFirstLetter() {
    $('input').on('keydown', function(event) {
        if (this.selectionStart == 0 && event.keyCode >= 65 && event.keyCode <= 90 && !(event.shiftKey) && !(event.ctrlKey) && !(event.metaKey) && !(event.altKey)) {
           const $t = $(this);
           event.preventDefault();
           const char = String.fromCharCode(event.keyCode);
           $t.val(char + $t.val().slice(this.selectionEnd));
           this.setSelectionRange(1,1);
        }
    });
};

function renderAgendaLength() {
    $("#agenda-length").text(`${agendaNumbers.length}`);
};

function init() {
    createListMenu();
    inputFirstLetter();
    inputPhoneNumber();
    inputFormat();
    renderAgendaLength();
};

function backButtonFunctionality() {
    $('.jqx-listmenu-header').children($(".span")).click(function(){
        $(this).children($(".span")).css("visibility", "hidden");
        $(".utilities").css("visibility", "visible");
        $(".jqx-listmenu-auto-separator").css("display", "block");
        $(".contact-main").css("border-bottom", "thin thistle solid");
        $(".contact-name").css("display", "block");
        $(`.${format(clickedContact)}`).val(`${clickedContact}`);
        $(`.${format(clickedContact)}message`).css("visibility", "hidden");
        $(`.${format(clickedContact)}number`).val(`${clickedContactNumber}`);
    })
};

function clickOnContactFunctionality() {
    $('.contact').click(function(){
        $('.jqx-listmenu-header span').css("visibility", "visible");
        $(".utilities").css("visibility", "hidden");
        $("#search-contact").val("");
    })
};

function searchBarFunctionality() {
    $("#search-contact").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        $(".jqx-listmenu-auto-separator").css("display", "none");
        $(".contact-name").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) === 0);
            if($(this).css("display") === "none"){
                $(this).closest(".contact-main").css("border", "none");
            }else {
                $(this).closest(".contact-main").css("border-bottom", "thin thistle solid");
            } 
        });
        if(!value){
            $(".jqx-listmenu-auto-separator").css("display", "block");
        }
    });
};

function modalShow() {
    $("#add-contact").click(function(){
        $(".modal").css("display", "block");
        $(".modal-message").css("visibility", "hidden");
    })
};

function modalHide() {
    $(".close").click(function(){
        $(".modal").css("display", "none");
        $(".modal-message").css("visibility", "hidden");
        $(".modal-number").jqxMaskedInput('clearValue');
        $(".modal-name").val('');
    })
};

function getClickedContact() {
    $(".container").on('click','.contact',function(){
        clickedContact = $(this).children($(".contact-name")).text().trim();
        agendaNumbers.forEach(contact => {
            if(contact.name === clickedContact) {
                clickedContactNumber = contact.number.replace(/\s+/g, '');
            }
        })
    });
};

function enableFunctionalities() {
    backButtonFunctionality();
    searchBarFunctionality();
    clickOnContactFunctionality();
    getClickedContact();
};

function addContactFunctionality() {
    modalShow();
    modalHide();
    $(".modal-btn").click(function(){
        const inputName = $(`.modal-name`).val().trim();
        const inputNumber = $(`.modal-number`).val();
    if(inputNumber.includes("_") || inputNumber === '' || inputName.length === 0 || inputName.length > 25 ){
        $(`.modal-message`).text("Wrong input!").css("visibility", "visible");
        $(`.modal-number`).jqxMaskedInput('clearValue');
    }else{
        $(`.modal-message`).css("visibility", "hidden");
        $(".modal").css("display", "none");
        $(`.modal-name`).val('');
        $(`.modal-number`).jqxMaskedInput('clearValue');
        destroyListMenu();
        sortAgenda(inputName, inputNumber);
        init();
        enableFunctionalities();
    }
    });

};

function editContactFunctionality() {
    $(".container").on('click','.edit-btn',function(){
        const inputName = $(`.${format(clickedContact)}`).val();
        if(inputName.charAt[0] === ' '){
            return inputName.trim().charAt(0).toUpperCase() + inputName.slice(1);
        }
        const inputNumber = $(`.${format(clickedContact)}number`).val();
        if(inputNumber.includes("_") || inputName.length === 0 || inputName.length > 25 ){
            $(`.${format(clickedContact)}message`).text("Wrong input!").css("visibility", "visible");
            $(`.${format(clickedContact)}number`).val(`${clickedContactNumber}`);
            $(`.${format(clickedContact)}`).val(`${clickedContact}`);
        }else{
            agendaNumbers.forEach((contact, i) => {
                if(clickedContact === contact.name) {
                    agendaNumbers.splice(i, 1);
                }
            });
            $(".utilities").css("visibility", "visible");
            destroyListMenu();
            sortAgenda(inputName, inputNumber);
            init();
            enableFunctionalities();
        }
    });
};

function deleteFunctionality() {
    $(".container").on('click','.delete-btn',function(){
        $(".utilities").css("visibility", "visible");
        agendaNumbers.forEach((contact, i) => {
            if(clickedContact === contact.name) {
                agendaNumbers.splice(i, 1);
            }
        });
        destroyListMenu();
        init();
        enableFunctionalities();
    });
};

$(document).ready(function () {
    init();
    enableFunctionalities();
    addContactFunctionality();
    editContactFunctionality();
    deleteFunctionality();
});
