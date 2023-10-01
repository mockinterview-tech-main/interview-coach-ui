<script lang="ts">
	import { onMount } from "svelte";

    export let modal;
    export let isOpen: boolean = false;

    const closeModal = (e: MouseEvent) => {
        if((e.target as HTMLElement)?.id === 'modal-background' || (e.target as HTMLElement)?.id === 'modal-close-btn'){
            isOpen = false;
        }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            isOpen = false;
        }
    }

    onMount(() => {
        if (typeof document !== "undefined") {
            document.addEventListener('keydown', handleEscapeKey);
            return () => {
                document.removeEventListener('keydown', handleEscapeKey);
            }
        }
    });

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="modal-background" on:click={closeModal} bind:this={modal} class={isOpen ? 'show modal' : 'modal'}>
    <div class="modal-content">
        <span id="modal-close-btn" class="close-btn" on:click={closeModal}>&times;</span>
        <slot/>
    </div>
</div>

<style>
    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        color: black;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .modal.show {
        display: block;
    }

    .modal-content {
        position: relative;
        border-radius: 5px;
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        width: 60%;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .close-btn {
        color: black;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close-btn:hover,
    .close-btn:focus {
        color: black;
        cursor: pointer;
    }
</style>
