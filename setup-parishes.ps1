# 1. Define the HTML content
$htmlContent = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/styles.css">
    <link rel="icon" type="image/x-icon" href="/res/favicon.ico">
    <script src="https://kit.fontawesome.com/a878311718.js" crossorigin="anonymous"></script>
</head>
<body>
    <header id="navBar">
        <div class="coat_of_arms">
            <img src="/res/Coat_of_arms_of_the_Diocese_of_Daet.png" alt="Coat of arms of the Diocese of Daet">
        </div>
        <div class="the_roman_catholic_diocese_of_daet">
            <h3>THE ROMAN CATHOLIC</h3>
            <hr>
            <h2>DIOCESE OF DAET</h2>
        </div>
        <p id="menuBtn" class="menu_button" onclick="showMenu()">☰</p>
        <nav id="navMenu">
            <ul>
                <li><a href="/">Home</a></li>
                <div class="about_subnav" id="about_subnav">
                    <ul>
                        <li><a href="/about/the-diocese.html">The Diocese</a></li>
                        <li><a href="/about/the-bishop.html">The Bishop</a></li>
                        <li><a href="/about/curia-and-officers.html">Curia & Officers</a></li>
                        <li><a href="/about/directory.html">Directory</a></li>
                        <li><a href="/about/vicariates.html">Vicariates</a></li>
                    </ul>
                </div>
                <li id="aboutBtn" onclick="showAboutSection(event)">About</li>
                <li><a href="/news.html">News</a></li>
                <li><a href="/contact-us.html">Contact Us</a></li>
            </ul>
        </nav>
    </header>
    <main>  
        <img id="church_image" src="" alt="Parish Image" style="width:100%; max-height:400px; object-fit:cover; border-radius:8px;">

        <h2 class="red_title" style="margin-left: 0;" id="name">Loading Parish...</h2>
        <p><span id="description"></span></p>
        <br><br>
        <div class="church_stuff">
            <div class="church_details">
                <p><strong>Vicariate:</strong> <span id="vicariate"></span></p>
                <p><strong>Titular:</strong> <span id="titular"></span></p>
                <p><strong>Parish Priest:</strong> <span id="parish_priest"></span></p>
                <p><strong>Address:</strong> <span id="address"></span></p>
                <p><strong>Founding Year:</strong> <span id="founding"></span></p>
                <p><strong>Feast Day:</strong> <span id="feast_day"></span></p>
                <p><strong>Email:</strong> <span id="email"></span></p>
                <p><strong>Phone:</strong> <span id="phone"></span></p>
                <div class="church_facebook">
                    <a id="facebook" href="#" target="_blank">
                        Visit Official Facebook
                    </a>
                </div>
            </div>
            <div class="church_images">
                <h3 style="display: flex; align-items: end; justify-content: space-between;">Church Images<span style="font-weight: lighter; color: #8b8b8b; font-size: 70%;">click image to view</span></h3>
                <div class="church_images_row">
                    <div class="church_image_holder">
                        <img data-path="/res/church_images/{ID}/image1.jpg" class="clickable-img" onclick="openLightbox(this)">
                    </div>
                    <div class="church_image_holder">
                        <img data-path="/res/church_images/{ID}/image2.jpg" class="clickable-img" onclick="openLightbox(this)">
                    </div>
                </div>
                <div class="church_image_holder stand_alone">
                    <img data-path="/res/church_images/{ID}/image3.jpg" class="clickable-img" onclick="openLightbox(this)">
                </div>
            </div>
        </div>
    </main>
    <footer>
        <div style="display: flex; align-items: center;">
            <div class="coat_of_arms_footer">
                <img src="/res/Coat_of_arms_of_the_Diocese_of_Daet.png" alt="Coat of arms of the Diocese of Daet">
            </div>
            <div class="diocese_of_daet_contact_address">
                <h2>DIOCESE OF DAET</h2><hr>
                <h3>Brgy. Gahonon, Daet, 4600 Camarines Norte, Bicol, Philippines</h3>
                <h3>Email: daetchancery@yahoo.com</h3>
                <h3>Telephone: 0926 087 6901</h3>
            </div>
        </div>
        <div class="connect_soccom">
            <div class="connect_with_us">
                <h2>Connect with us:</h2>
                <i class="fa-brands fa-facebook"> Diyosis ng Daet</i>
            </div>
            <div class="coscamm">
                <img src="/res/COSCAMM.png" alt="">
            </div>
        </div>
    </footer>
    <div id="lightbox-overlay" onclick="closeLightbox()">
        <span id="lightbox-close">&times;</span>
        <img id="lightbox-img">
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const pathSegments = window.location.pathname.split('/');
            const objectName = pathSegments[pathSegments.length - 2]; 

            fetch('/parishes.json')
                .then(response => response.json())
                .then(jsonData => {
                    const folderData = jsonData[objectName];

                    if (folderData) {
                        Object.keys(folderData).forEach(key => {
                            const element = document.getElementById(key);
                            if (element) {
                                if (element.tagName === 'IMG') element.src = folderData[key];
                                else if (element.tagName === 'A') element.href = folderData[key];
                                else element.innerText = folderData[key];
                            }
                        });

                        const pathElements = document.querySelectorAll('[data-path]');
                        pathElements.forEach(el => {
                            const rawPath = el.getAttribute('data-path');
                            const finalPath = rawPath.replace('{ID}', objectName);
                            if (el.tagName === 'IMG') {
                                el.src = finalPath;
                            } else if (el.tagName === 'A') {
                                el.href = finalPath;
                            }
                        });
                    }
                });
        });

        function openLightbox(element) {
            const overlay = document.getElementById("lightbox-overlay");
            const fullImg = document.getElementById("lightbox-img");
            overlay.style.display = "block";
            fullImg.src = element.src;
            document.body.classList.add("no-scroll");
        }

        function closeLightbox() {
            document.getElementById("lightbox-overlay").style.display = "none";
            document.body.classList.remove("no-scroll");
        }
    </script>
    <script src="/script.js"></script>
</body>
</html>
'@

# 2. Read the JSON file and loop through the keys
$json = Get-Content -Raw "parishes.json" | ConvertFrom-Json
$keys = $json | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name

foreach ($key in $keys) {
    # 3. Create folder
    $path = "parishes\$key"
    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force
    }
    
    # 4. Create info.html
    $htmlContent | Out-File -FilePath "$path\info.html" -Encoding utf8
}

Write-Host "Success! Folders and info.html files created." -ForegroundColor Green