    $( document ).ready(function() {

        var km = 0;

        $("#delivery-payment-calc-to").keyup(function() {
            $(".delivery-count-from").hide();

            $("#delivery-payment-select_market").css("color", "#337ab7");
            $("#delivery-payment-nearest").css("color", "#337ab7");

            $("#delivery-payment-nearest").prop( "checked", false );
            $("#delivery-payment-calc-from").prop( "disabled", false );
            $("#delivery-payment-result").text("");
            $("#delivery-payment-price").text("");
        });
        $(".delivery-type input").click(function() {
            //$("#delivery-payment-result").text("");
            $("#delivery-payment-price").text("");
        });
        //--------------------------открыть/закрыть---------------------------------------
        $(".delivery-paym").click(function() {
            $(".delivery-payment-calc").css("display", "block");
            $(".delivery-payment-calc-bg").css("display", "block");
        });

        $(".delivery-payment-calc-close").click(function() {
            $(".delivery-payment-calc").css("display", "none");
            $(".delivery-payment-calc-bg").css("display", "none");
        });

        //-------------------ВВОД АДРЕСА ДОСТАВКИ, пересчет расстояния до каждого магазина

        $("#delivery-payment-nearest").click(function () {

            var index = 1;
            $("#delivery-payment-result").text("");
            $("#delivery-payment-price").text("");
            //-----------------------------------------------------------------
            var selectList = $('#delivery-payment-calc-from option');
            selectList.sort(function(a,b){
                a = a.value;
                b = b.value;

                return a-b;
            });
            $('#delivery-payment-calc-from').html(selectList);
            //-------------------------------------------------------------------

            if ($("#delivery-payment-calc-to").val() != "") {

                $("#delivery-payment-select_market").css("color", "#337ab7");
                $("#delivery-payment-nearest").css("color", "green");

                var count = 1;

                $("#delivery-payment-calc-from").prop( "disabled", true );
                $("#delivery-payment-calc-from option").each(function()
                {
                    ymaps.route([$(this).text(), $("#delivery-payment-calc-to").val()]).then(function (route) {
                        $( this ).parent().text(Math.round(route.getLength()/ 1000));
                        $("#delivery_km_" + count.toString()).text(Math.round(route.getLength()/ 1000));
                        count++;
                        index = 1;
                        var min = parseInt($("#delivery_km_1").text());

                        $("#delivery-payment-calc-from").val(index);

                        $("#delivery_km span").each(function()
                        {
                            if (parseInt($(this).text())<min) {
                                min = parseInt($(this).text());
                                index = $(this).attr('id').split("_");
                                index = index[2];

                            }
                            $("#delivery-payment-calc-from").val(index);
                        });
                    });
                });

                $(".delivery-count-from").show();
            }
            else alert("Введите адрес доставки.");
        });

        $("#delivery-payment-select_market").click(function () {

            $("#delivery-payment-result").text("");
            $("#delivery-payment-price").text("");
            $("#delivery-payment-calc-from").prop( "disabled", false);

            //-----------------------------------------------------------------
            var selectList = $('#delivery-payment-calc-from option');
            selectList.sort(function(a,b){
                a = a.value;
                b = b.value;

                return a-b;
            });
            $('#delivery-payment-calc-from').html(selectList);
            //-------------------------------------------------------------------

            if ($("#delivery-payment-calc-to").val() != "") {

                $("#delivery-payment-select_market").css("color", "green");
                $("#delivery-payment-nearest").css("color", "#337ab7");


                $("#delivery-payment-calc-from").val(1);
                $(".delivery-count-from").show();
            }
            else alert("Введите адрес доставки.");
        });
        //---------------------------------------------------------------

        //-----------------------Пересчет стоимости доставки----------------------------------
        $("#delivery-payment-calculate").click(function () {
            if ($("#delivery-payment-calc-to").val() != "") {
                if ($(".delivery-count-from").is(':visible')) {
                    document.getElementById('map1').innerHTML = '';
                    ymaps.ready( init($("#delivery-payment-calc-from").find('option:selected').attr("name"), $("#delivery-payment-calc-to").val()));
                }
                else alert("Выберите магазин.");
            }
            else alert("Введите адрес доставки.");
        });
    });


    //-------------------------Инициализация карты------------------------------
    ymaps.ready(init);

    function init(a, b) {
        var myMap = new ymaps.Map("map1", {
            center: [48.019217, 37.799760],
            zoom: 10
        });

        ymaps.route([a, b]).then(function (route) {
            myMap.geoObjects.add(route);
            $("#delivery-payment-result").text(Math.round(route.getLength()/ 1000)+" км");

//-----------------------------------РАСЧЕТ СТОИМОСТИ ДОСТАВКИ----------------------------------------------------------
            //-----------------------Тарифы---------------------------------------
            var obj = $.parseJSON( $("#delivery_tarifs").text() );
            var discount = obj.discount; //акции

            //-------------------Тип доставки---------------------
            if (document.getElementById("delivery-type-2").checked == true) { obj = obj.express; }
            else if (document.getElementById("delivery-type-3").checked == true) { obj = obj.vipexpress; }
            else { obj = obj.target; }


            var totalprice = Math.round(route.getLength()/ 1000)*parseInt(obj[0]['more'])+" руб.";

            if (Math.round(route.getLength()/ 1000)<=20){
                totalprice = obj[0][20]+" руб. (стоимость доставки до 20-ти км)";
            }
            if (Math.round(route.getLength()/ 1000)<=15){
                totalprice = obj[0][15]+" руб. (стоимость доставки до 15-ти км)";
            }
            if (Math.round(route.getLength()/ 1000)<=10){
                totalprice = obj[0][10]+" руб. (стоимость доставки до 10-ти км)";
            }
            if (Math.round(route.getLength()/ 1000)<=5){
                totalprice = obj[0][5]+" руб. (стоимость доставки до 5-ти км)";
            }
            if (Math.round(route.getLength()/ 1000)<=3){
                totalprice = obj[0][3]+" руб. (стоимость доставки до 3-х км)";
            }

            if (discount){
                if((a.indexOf('Горловка') + 1)&&((b.indexOf('Дебальцево') + 1)|(b.indexOf('дебальцево') + 1))) {
                    totalprice = discount[0]['Debaltsevo']+" руб. (акция)";
                }
                if((a.indexOf('Горловка') + 1)&&((b.indexOf('Енакиево') + 1)|(b.indexOf('енакиево') + 1))) {
                    totalprice = discount[0]['Enakievo']+" руб. (акция)";
                }
                if((a.indexOf('Горловка') + 1)&&((b.indexOf('Углегорск') + 1)|(b.indexOf('углегорск') + 1))) {
                    totalprice = discount[0]['Uglegorsk']+" руб. (акция)";
                }
            }

            $("#delivery-payment-price").text(totalprice);
        });
    }