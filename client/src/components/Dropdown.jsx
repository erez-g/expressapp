import React, { useEffect, useState, useRef } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';

const Dropdown = ({externalEffect,...props}) => {
    const [value,setValue] = useState(0);
    const [inputValue,setInputValue] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [isdisabled,setDisabled] = useState(props.disabled);
    const {type, className, fieldName} = props;
    // console.log(type,isdisabled);
    
    const handleChange = val => {
        if (!val) return;
        setInputValue(val.label);
        setValue(val);
    }

    const determinePlaceholder = () => {
        if (type =='artist') {
            return 'Type artist name...'
        }//else album
        return (isdisabled) ? 'Choose artist first' : 'Type Album Name';
    }
    const placeholder = determinePlaceholder();

    const isInitialMount = useRef(true);
    const prevValue = useRef();
    useEffect(() => {
        console.log('ayyy');
        if (isInitialMount.current) {
        isInitialMount.current = false 
        } else {
            if (externalEffect) externalEffect(value,type);
        }
        prevValue.current = value;
    }, [value])
    useEffect(() => {
        if (!isInitialMount.current) {
            if (props.value.id === 0) {
                setInputValue('');
            }
            console.log('usedeffect')
            console.log(props.value);

            console.log('prevValue.current');
            console.log(prevValue.current);
        }
    }, [props.value])

    const handleInputChange = (val, {action}) => {
        if (action !== "set-value") setInputValue(val);
    }

    const loadOptions = (inputValue) => {
        if (!inputValue) return;
        const result = fetch(`/api/artists?name=${inputValue.toLowerCase()}`)
            .then(res => res.json()
            ).catch(err=>{
                console.log('error:',err);
                return;
            });
            // console.log('GET result:', result);
            return result;
    };

    const style = {
        control: (base, state) => ({
          ...base,
          boxShadow: state.isFocused ? 0 : 0,
          outline: state.isFocused ? '1px solid var(--brand)' : '0',
          outlineOffset: '1px',
          "&:hover": {
            border: state.isFocused ? 0 : 0
          }
        })
      };

    const formatCreateLabel = (inputValue) => {
        return `Add artist "${inputValue}"`;
    };
        
    const handleGetOptionData = (inputValue, optionLabel) => {
        return {
            id: inputValue,
            name: optionLabel,
            __isNew__: true
        };
    };

    const createOption = (label, value) => ({
        label,
        value
        });

    const handleCreateOption = (input) => {
        console.log('creating... ', input);
        setLoading(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: input
            })
        };
        fetch('/api/artists', requestOptions)
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                const newOption = createOption(data.name,data.id)
                setValue(newOption);
                setInputValue(newOption.label);
            }).catch(err => {
                console.log('error!', err);
            });
        }
    return (
        <>
        <AsyncCreatableSelect
            className={className +' '+ ((isdisabled) ? 'disabled' : '')}
            name={fieldName}
            getOptionLabel={e => e.name}
            getOptionValue={e => e.id}
            onCreateOption={handleCreateOption}
            getNewOptionData={handleGetOptionData}
            loadOptions={loadOptions}
            onChange={handleChange}
            placeholder={placeholder}
            isDisabled={isLoading || isdisabled}
            isLoading={isLoading}
            styles={style}
            isClearable={true}
            allowCreateWhileLoading={true} 
            formatCreateLabel={formatCreateLabel}
            components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            noOptionsMessage={(e) => e.inputValue ? 'No options' : null}
            // value={value}
            inputValue={inputValue}
            onInputChange={handleInputChange}
      />
      </>
    )
}

Dropdown.defaultProps = {
    externalEffect: ()=> {
        // console.log('not doing anything here')
    }
}

export default Dropdown;