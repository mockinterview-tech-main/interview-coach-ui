<!-- Uses a horizontal loading gif and optionally lets user add text or inline elements -->
<script lang="ts">
    import Loading from "$lib/assets/icons/loading.svg";

    type Size = "xs" | "s" | "m" | "l" | "xl" 
    type Position = "l" | "c" | "r"

    export let size: Size;
    export let position: Position;
    let imgWidth = 30;
    let pos = "center";

    switch(position) {
        case "l":
            pos = "left";
            break;
        case "c":
            pos = "center";
            break;
        case "r":
            pos = "right";
            break;
        default:
            pos = "center";
            break;
    }

    switch(size) {
        case "xs":
            imgWidth = 10;
            break;
        case "s":
            imgWidth = 20;
            break;
        case "m":
            imgWidth = 30;
            break;
        case "l":
            imgWidth = 40;
            break;
        case "xl":
            imgWidth = 50;
            break;
        default:
            imgWidth = 30;
            break;
    }


</script>

<img class="loading-{pos}" style="width: {imgWidth}%" alt="loading" src={Loading}/>
<p class="loading-{pos}"><slot/></p>

 <style lang="scss">
    .loading-left {
        display: block;
    }
    .loading-center {
        margin: auto;
        display: block;
        text-align: center;
    }

 </style>