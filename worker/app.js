const API_URL =
    "https://trendify-setup-api.berni-khan61-ba9.workers.dev";

const startButton =
    document.getElementById("startButton");

const githubToken =
    document.getElementById("githubToken");

const cloudflareToken =
    document.getElementById("cloudflareToken");

const cloudflareAccountId =
    document.getElementById("cloudflareAccountId");

const status =
    document.getElementById("status");

const togglePassword =
    document.getElementById("togglePassword");

const toggleCloudflarePassword =
    document.getElementById("toggleCloudflarePassword");


// GitHub password visibility
togglePassword.addEventListener("click", () => {

    if (githubToken.type === "password") {
        githubToken.type = "text";
    } else {
        githubToken.type = "password";
    }

});


// Cloudflare password visibility
toggleCloudflarePassword.addEventListener("click", () => {

    if (cloudflareToken.type === "password") {
        cloudflareToken.type = "text";
    } else {
        cloudflareToken.type = "password";
    }

});


function showStatus(message) {

    status.textContent = message;

    status.classList.remove("hidden");

}


startButton.addEventListener("click", async () => {

    const github =
        githubToken.value.trim();

    const cloudflare =
        cloudflareToken.value.trim();
const accountId =
    cloudflareAccountId.value.trim();

    // Check GitHub Token
    if (!github) {

        showStatus(
            "❌ لطفاً GitHub Token را وارد کنید."
        );

        return;
    }


    // Check Cloudflare Token
    if (!cloudflare) {

        showStatus(
            "❌ لطفاً Cloudflare API Token را وارد کنید."
        );

        return;
    }
if (!accountId) {

    showStatus(
        "❌ لطفاً Cloudflare Account ID را وارد کنید."
    );

    return;
}


    startButton.disabled = true;

    startButton.innerHTML =
        "⏳ در حال راه‌اندازی...";


    showStatus(
        "🔄 در حال اتصال به GitHub و Cloudflare..."
    );


    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

    githubToken: github,

    cloudflareToken: cloudflare,

    accountId: accountId

})
            }
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "راه‌اندازی ناموفق بود."
            );

        }


        showStatus(
    `✅ پروژه با موفقیت ساخته شد!\n\n` +
    `📦 Repository: ${data.repository}\n\n` +
    `📄 Dockerfile ✓\n` +
    `📄 railway.conf ✓\n` +
    `📄 start-railway.sh ✓\n\n` +
    `☁️ Cloudflare Worker ✓\n\n` +
    `🔗 Worker URL:\n${data.workerUrl}`
);

const workerUrlBox = document.createElement("div");

workerUrlBox.innerHTML = `
    <div style="
        margin-top: 20px;
        padding: 15px;
        border-radius: 14px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
    ">
        <div style="
            font-size: 13px;
            margin-bottom: 8px;
            opacity: 0.7;
        ">
            🔗 Worker URL
        </div>

        <div style="
            word-break: break-all;
            margin-bottom: 12px;
            font-size: 14px;
        ">
            ${data.workerUrl}
        </div>

        <button
            id="copyWorkerUrl"
            style="
                width: 100%;
                padding: 11px;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
            "
        >
            📋 کپی Worker URL
        </button>
    </div>
`;

status.appendChild(workerUrlBox);

document
    .getElementById("copyWorkerUrl")
    .addEventListener("click", async () => {

        await navigator.clipboard.writeText(data.workerUrl);

        document.getElementById("copyWorkerUrl").textContent =
            "✅ کپی شد!";
    });

        startButton.innerHTML =
            "✅ Setup آماده است";


        // GitHub button

        const githubButton =
            document.createElement("a");


        githubButton.href =
            data.repositoryUrl;


        githubButton.target =
            "_blank";


        githubButton.rel =
            "noopener noreferrer";


        githubButton.textContent =
            "🔗 مشاهده Repository در GitHub";


        githubButton.style.display =
            "block";


        githubButton.style.marginTop =
            "16px";


        githubButton.style.textAlign =
            "center";


        githubButton.style.textDecoration =
            "none";


        githubButton.style.cursor =
            "pointer";


        status.parentNode.appendChild(
            githubButton
        );


    } catch (error) {

        console.error(error);


        showStatus(
            `❌ ${error.message}`
        );


        startButton.disabled =
            false;


        startButton.innerHTML =
            "🚀 شروع Setup";

    }

});
