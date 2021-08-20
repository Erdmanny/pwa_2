<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="shortcut icon" type="image/x-icon" href="/logo.ico">
    <link rel="manifest" href="/manifest.webmanifest">
    <title>PWA 2</title>
    <meta name="theme-color" content="#FFE1C4">

    <link rel="apple-touch-icon" href="/icon/icon96.png">
<!--    <meta name="apple-mobile-web-app-status-bar" content="#aa7700">-->


    <!--Bootstrap CSS-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <!--Bootstrap-Table CSS-->
    <link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.18.0/dist/bootstrap-table.min.css">
    <!--    Bootstrap Icons-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
</head>

<body class="bg-dark">


<nav class="navbar navbar-light bg-light sticky-top">
    <a class="navbar-brand" href="/people">PWA 2</a>
    <div class="ml-auto d-flex" id="nav-buttons"></div>
</nav>

<script type="application/javascript">


    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    if (navigator.onLine) {
        document.getElementById("nav-buttons").innerHTML = "<button id='pushButton' class='btn btn-primary mr-2 d-flex justify-content-center align-items-center'>Allow Push</button>" +
            "<a href='/logout'><button class='btn btn-warning mr-2'> Logout</button></a>" +
            "<div id='show-online' class='bg-success d-flex justify-content-center align-items-center p-2'>Online </div>"
    } else {
        document.getElementById("nav-buttons").innerHTML = "<button id='pushButton' class='btn btn-primary mr-2 d-flex justify-content-center align-items-center' disabled>Allow Push</button>" +
            "<a href='/logout'><button class='btn btn-warning mr-2' disabled> Logout</button></a>" +
            "<div id='show-online' class='bg-danger d-flex justify-content-center align-items-center p-2'>Offline </div>"
    }
</script>

<div class="container">
    <h1 class="mt-3 text-light">People</h1>
    <div class="row mt-3">


        <div class="col-lg-12">
            <div class="card">
                <div class="card-header row">
                    <a type="button" class="col-lg-2 btn btn-primary" href="http://localhost/people/addPerson">
                        Add Person
                    </a>

                    <div class="col-1"></div>
                    <div id="feedback" class="col-10 text-light col-lg-9 d-flex justify-content-center align-items-center"></div>

                </div>
                <div class="card-body">
                    <table
                            id="peopleTable"
                            data-toggle="table"
                            data-mobile-responsive="true"
                            data-pagination="true">

                    </table>
                </div>
            </div>

        </div>

    </div>
</div>

<script>
    function deletePerson(id) {
        if (navigator.onLine) {
            if (confirm("Are you sure you want to remove the person with id " + id + " ?")) {
                window.location.href = "http://localhost/people/deletePerson/" + id;
            }
        } else {
            alert("You cannot delete a person while offline.")
        }
    }


    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf("error") === 0) {
            let text = c.split("=")[1];
            document.getElementById("feedback").classList.add("bg-error");
            document.getElementById("feedback").innerText = text;
         }
        if (c.indexOf("success") === 0) {
            let text = c.split("=")[1];
            document.getElementById("feedback").classList.add("bg-success");
            document.getElementById("feedback").innerText = text;
        }
    }
</script>

<!--JQuery JS-->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

<!--Popper JS-->
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>

<!--Bootstrap JS-->
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>

<!--Bootstrap-Table JS-->
<script src="https://unpkg.com/bootstrap-table@1.18.0/dist/bootstrap-table.min.js"></script>

<!--Bootstrap-Table-Mobile JS-->
<script src="https://unpkg.com/bootstrap-table@1.18.1/dist/extensions/mobile/bootstrap-table-mobile.min.js"></script>

<script src="/app.js"></script>

</body>
</html>
