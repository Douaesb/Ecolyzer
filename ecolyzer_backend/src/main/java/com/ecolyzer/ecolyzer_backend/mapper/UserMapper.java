package com.ecolyzer.ecolyzer_backend.mapper;

import com.ecolyzer.ecolyzer_backend.dto.request.UserRequestDTO;
import com.ecolyzer.ecolyzer_backend.model.Role;
import com.ecolyzer.ecolyzer_backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roles", expression = "java(mapRolesToStrings(user.getRoles()))")
    UserRequestDTO toDTO(User user);

    @Mapping(target = "roles", ignore = true)
    User toEntity(UserRequestDTO userDTO);

    default List<String> mapRolesToStrings(List<Role> roles) {
        return roles.stream().map(Role::getName).toList();
    }
}