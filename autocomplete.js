const createAutoComplete = ({ 
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue,
    fetchData
}) => {
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown"> 
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async (event) => {
        const items = await fetchData(event.target.value);

        if (!items.length) {
            dropdown.classList.remove('is-active');
        } else {
            resultsWrapper.innerHTML = '';
            dropdown.classList.add('is-active');

            for (let item of items) {
                let option = document.createElement('a');
                
                option.classList.add('dropdown-item');
                option.innerHTML = renderOption(item);

                option.addEventListener('click', (e) => {
                    dropdown.classList.remove('is-active');
                    input.value = inputValue(item);
                    onOptionSelect(item);
                });
                resultsWrapper.appendChild(option);
            }
        }

        return;
    };

    input.addEventListener('input', debounce(onInput));

    document.addEventListener('click', (e) => {
        console.log('new click');
        if (!root.contains(e.target)) {
            dropdown.classList.remove('is-active');
        }
    });

}