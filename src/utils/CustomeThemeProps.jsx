const customeThemeProps = {
    components: {
        Button: {
            baseStyle: {
                borderRadius: "6px",
            },
        },
        UploadStep: {
            baseStyle: {
                direction: "rtl",
            },
        },

        Modal: {
            baseStyle: {
                dialog: {
                    direction: "rtl",
                },
            },
        },
    },
    styles: {
        global: {
            // Set the global background color if applicable
            body: {
                background:
                    "radial-gradient(circle at 50% -50%, #89fff6, white 70%) no-repeat",
                backgroundSize: "100% 200%",
                margin: 0,
                placeItems: "center",
                minWidth: 320,
                minHeight: "100vh",
            },
        },
    },
}

export default customeThemeProps;