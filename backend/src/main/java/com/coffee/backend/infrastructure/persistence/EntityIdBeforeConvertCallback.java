package com.coffee.backend.infrastructure.persistence;

import com.coffee.backend.application.service.SequenceGeneratorService;
import com.coffee.backend.domain.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertCallback;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EntityIdBeforeConvertCallback implements BeforeConvertCallback<Object> {
    private final SequenceGeneratorService sequenceGeneratorService;

    @Override
    public Object onBeforeConvert(Object entity, String collection) {
        if (entity instanceof User) {
            User user = (User) entity;
            if (user.getId() == null) {
                user.setId(sequenceGeneratorService.generateSequence(User.class.getSimpleName().toLowerCase() + "_sequence"));
            }
        } else if (entity instanceof CoffeeTable) {
            CoffeeTable table = (CoffeeTable) entity;
            if (table.getId() == null) {
                table.setId(sequenceGeneratorService.generateSequence(CoffeeTable.class.getSimpleName().toLowerCase() + "_sequence"));
            }
        } else if (entity instanceof MenuItem) {
            MenuItem item = (MenuItem) entity;
            if (item.getId() == null) {
                item.setId(sequenceGeneratorService.generateSequence(MenuItem.class.getSimpleName().toLowerCase() + "_sequence"));
            }
        } else if (entity instanceof Reservation) {
            Reservation reservation = (Reservation) entity;
            if (reservation.getId() == null) {
                reservation.setId(sequenceGeneratorService.generateSequence(Reservation.class.getSimpleName().toLowerCase() + "_sequence"));
            }
        } else if (entity instanceof OrderItem) {
            OrderItem orderItem = (OrderItem) entity;
            if (orderItem.getId() == null) {
                orderItem.setId(sequenceGeneratorService.generateSequence(OrderItem.class.getSimpleName().toLowerCase() + "_sequence"));
            }
        }
        return entity;
    }
}
